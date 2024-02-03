import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { show_alerta } from "../functions";
import NavBarAsis from "./Asistente/navbaras";
import Footer from "./footer";
import FooterHP from "./otros/footerHP";
import "./styles/boletos.css";
function BoletosList() {
  const [cantidad, setCantidad] = useState(0);
  const [stock, setStock] = useState(0);
  const [boletos, setBoletos] = useState([]);
  const [nuevBoletos, setNuevBoletos] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalBoletosSeleccionados, setTotalBoletosSeleccionados] = useState(0);
  const navigate = useNavigate();
  const [imagen, setImagen] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [boletosConStock, setBoletosConStock] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    // Función para obtener los eventos desde tu API
    const fetchEventos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/vereven/");
        setEventos(response.data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    // Llamar a la función para obtener eventos al montar el componente
    fetchEventos();
  }, []);

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
      const updatedBoletos = await Promise.all(
        boletos.map(async (boleto) => {
          try {
            const response = await fetch(
              `http://localhost:8000/api/verstockv/${boleto.id_boleto}/`
            );
            const data = await response.json();
            return { ...boleto, stock: data.stock }; // Actualizamos el boleto con el stock actual
          } catch (error) {
            console.error(
              `Error al obtener el stock del boleto ${boleto.id_boleto}:`,
              error
            );
            return { ...boleto, stock: 0 }; // Si hay un error, establecemos el stock en 0
          }
        })
      );

      setBoletosConStock(updatedBoletos); // Actualizamos los boletos con el stock
    };

    if (boletos.length > 0) {
      fetchStockForBoletos();
    }
  }, [boletos]); // Este useEffect depende del estado 'boletos'

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
    const boletosSeleccionados1 = boletos.filter((boleto) => boleto.isChecked);
    if (boletosSeleccionados1.length === 0) {
      show_alerta(
        "Debe seleccionar al menos un boleto para continuar",
        "warning"
      );
      return;
    }

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
      <NavBarAsis />
      <br></br>
      <h1 className="display-4 text-center mb-4">BOLETOS DISPONIBLES</h1>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-5 mx-auto">
            {eventos.find((evento) => evento.id_evento === parseInt(id)) && (
              <img
                src={
                  eventos.find((evento) => evento.id_evento === parseInt(id))
                    .imagen
                }
                alt={`Imagen del evento ${
                  eventos.find((evento) => evento.id_evento === parseInt(id))
                    .nombre_evento
                }`}
                className="img-fluid"
              />
            )}
            <ul className="list-group">
              {boletos
                .filter((boleto) => parseInt(boleto.id_evento) === parseInt(id))
                .map((boleto, index) => {
                  const eventoCorrespondiente = eventos.find(
                    (evento) => evento.id_evento === parseInt(id)
                  );
                  //const imagenEvento = eventoCorrespondiente
                  //? eventoCorrespondiente.imagen
                  //: null;

                  return (
                    <li key={boleto.id_boleto}>
                      {/* {imagenEvento && (
                        <img
                          src={imagenEvento}
                          alt={`Imagen del evento ${eventoCorrespondiente.nombre_evento}`}
                          className="img-fluid"
                        />
                      )} */}
                      <div
                        style={{ paddingTop: "15px", color: "#2980b9" }}
                        className="tipo-boleto1"
                      >
                        <h4>
                          <strong>Tipo de boleto:</strong> {boleto.tipoBoleto}
                        </h4>
                      </div>
                      <div className="form-check checkbox-container">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={boleto.isChecked}
                          id={`checkbox-${boleto.id_boleto}`}
                          onChange={() => {
                            // Verificar si ya hay otro boleto seleccionado
                            const otroBoletoSeleccionado = boletos.some(
                              (b) =>
                                b.isChecked && b.id_boleto !== boleto.id_boleto
                            );
                            if (otroBoletoSeleccionado) {
                              show_alerta(
                                "Solo puede seleccionar un tipo de boleto",
                                "warning"
                              );
                              return;
                            }
                            setBoletos((prevBoletos) =>
                              prevBoletos.map((b) =>
                                b.id_boleto === boleto.id_boleto
                                  ? { ...b, isChecked: !b.isChecked }
                                  : b
                              )
                            );
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbox-${boleto.id_boleto}`}
                        >
                          Elija esta opción para continuar:
                        </label>
                      </div>
                      {boleto.isChecked && (
                        <div className="input-group mt-3">
                          <input
                            type="number"
                            className="form-control"
                            id={`cantidad-${index}`}
                            placeholder="Cantidad a Adquirir"
                            aria-label="Cantidad"
                            aria-describedby={`cantidad-label-${index}`}
                            min="1"
                            max={nuevBoletos[index]}
                            onChange={(e) => {
                              const cantidad =
                                parseInt(e.target.value, 10) || 0; // El || 0 es para manejar NaN cuando el input esté vacío
                              setCantidad(cantidad);
                              setBoletos((prevBoletos) =>
                                prevBoletos.map((b) =>
                                  b.id_boleto === boleto.id_boleto
                                    ? { ...b, cantidad }
                                    : b
                                )
                              );
                            }}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="col-md-5">
            {boletosConStock
              .filter((boleto) => parseInt(boleto.id_evento) === parseInt(id))
              .map((boleto, index) => (
                <div key={boleto.id_boleto}>
                  <div
                    className="precio-stock-container"
                    style={{ backgroundColor: "#6aabb5" }}
                  >
                    <div className="precio-label">
                      <strong>Tipo:</strong> {boleto.tipoBoleto}
                      <br></br>
                      <strong>Precio:</strong> ${boleto.precio}
                    </div>
                    <div className="stock-label">
                      <strong>Stock:</strong> {boleto.stock}
                    </div>
                  </div>
                  <br></br>
                </div>
              ))}
            <div className="text-center mt-3">
              {boletos.some((boleto) => boleto.isChecked) && (
                <p style={{ color: "#2980b9" }} className="total-pagar">
                  Total a Pagar: ${total}
                </p>
              )}
              <p style={{ color: "#2980b9" }} className="total-llevar">
                Total de boletos a llevar: {totalBoletosSeleccionados}
              </p>
              <div className="button-container">
                {boletos.filter((boleto) => boleto.isChecked) && (
                  <button
                    onClick={() => handleRealizarPedido(cantidad)}
                    style={{
                      backgroundColor: "#92c7a3",
                      borderColor: "#92c7a3",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                    }}
                  >
                    REALIZAR COMPRA
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default BoletosList;
