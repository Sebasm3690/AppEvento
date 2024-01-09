import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { show_alerta } from "../functions";

function BoletosList() {
  const [cantidad, setCantidad] = useState(0);
  const [stock, setStock] = useState(0);
  const [boletos, setBoletos] = useState([]);
  const [nuevBoletos, setNuevBoletos] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalBoletosSeleccionados, setTotalBoletosSeleccionados] = useState(0);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    // Verificar autenticación al cargar el componente
    const checkAuthentication = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/asistente", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status !== 200) {
          navigate("/loginas");
        }
      } catch (error) {
        console.error("Error al verificar la autenticación:", error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    // Cargar los boletos desde tu API original
    fetch("http://localhost:8000/api/api/v1/boleto/")
      .then((response) => response.json())
      .then((data) =>
        setBoletos(
          data.map((boleto) => ({ ...boleto, isChecked: false, cantidad: 0 }))
        )
      )
      .catch((error) => console.error("Error al obtener los boletos:", error));
  }, []);

  useEffect(() => {
    const fetchStockForBoletos = async () => {
      const promises = boletos.map((boleto) => {
        return fetch(`http://localhost:8000/api/verstockv/${boleto.id_boleto}/`)
          .then((response) => response.json())
          .then((data) => data.stock)
          .catch((error) => {
            console.error(
              `Error al obtener el stock del boleto ${boleto.id_boleto}:`,
              error
            );
            return 0;
          });
      });

      Promise.all(promises).then((stockValues) => {
        setNuevBoletos(stockValues);
      });
    };

    fetchStockForBoletos();
  }, [boletos]);

  useEffect(() => {
    let suma = 0;
    let totalCantidad = 0;
    boletos.forEach((boleto) => {
      if (boleto.isChecked && boleto.cantidad) {
        suma += boleto.cantidad * boleto.precio;
        totalCantidad += boleto.cantidad;
      }
    });
    setTotal(suma);
    setTotalBoletosSeleccionados(totalCantidad);
  }, [boletos]);

  const handleRealizarPedido = async (cantidad) => {
    var boletosSeleccionados = boletos.find((boleto) => boleto.isChecked);
    if (cantidad > boletosSeleccionados.stock) {
      show_alerta(
        "La cantidad de boletos no puede ser mayor al stock",
        "warning"
      );
      return;
    } else if (cantidad <= 0) {
      show_alerta(
        "La cantidad de boletos a comprar debe ser mayor a 0",
        "warning"
      );
      return;
    }

    try {
      const authResponse = await fetch("http://localhost:8000/api/asistente", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (authResponse.status !== 200) {
        navigate("/loginas");
        return;
      }

      const boletosSeleccionados = boletos.filter((boleto) => boleto.isChecked);
      const idBoletosSeleccionados = boletosSeleccionados.map(
        (boleto) => boleto.id_boleto
      );
      window.location.href = `/payfinal/?total=${total}&idboleto=${idBoletosSeleccionados}&totalBoletosSeleccionados=${totalBoletosSeleccionados}`;
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
    }
  };

  return (
    <div>
      <h1>Boletos Disponibles</h1>
      <p>Total de boletos a llevar: {totalBoletosSeleccionados}</p>
      <ul>
        {boletos
          .filter((boleto) => parseInt(boleto.id_evento) === parseInt(id))
          .map((boleto, index) => (
            <li key={boleto.id_boleto}>
              <input
                type="checkbox"
                checked={boleto.isChecked}
                onChange={() => {
                  setBoletos((prevBoletos) =>
                    prevBoletos.map((b) =>
                      b.id_boleto === boleto.id_boleto
                        ? { ...b, isChecked: !b.isChecked }
                        : b
                    )
                  );
                }}
              />
              <strong>Tipo:</strong> {boleto.tipo},<strong> Precio:</strong> $
              {boleto.precio},<strong> Stock:</strong> {boleto.stock},
              <strong> Id:</strong> {boleto.id_boleto}
              {boleto.isChecked && (
                <input
                  type="number"
                  placeholder="Cantidad"
                  min="1"
                  max={nuevBoletos[index]}
                  onChange={(e) => {
                    setCantidad(e.target.value, 10);
                    setBoletos((prevBoletos) =>
                      prevBoletos.map((b) =>
                        b.id_boleto === boleto.id_boleto
                          ? { ...b, cantidad }
                          : b
                      )
                    );
                  }}
                />
              )}
            </li>
          ))}
      </ul>
      {boletos.some((boleto) => boleto.isChecked) && (
        <p>Total a pagar: ${total}</p>
      )}
      {boletos.filter((boleto) => boleto.isChecked) && (
        <button onClick={() => handleRealizarPedido(cantidad)}>
          Realizar Pedido
        </button>
      )}
    </div>
  );
}

export default BoletosList;
