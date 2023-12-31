import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BoletosList() {
  const [boletos, setBoletos] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalBoletosSeleccionados, setTotalBoletosSeleccionados] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación al cargar el componente
    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/asistente', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status !== 200) {
          navigate('/loginas');  // Redirigir al usuario a la página de inicio de sesión si no está autenticado
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    // Código para cargar los boletos desde tu API
    fetch('http://localhost:8000/api/api/v1/boleto/')
      .then(response => response.json()) 
      .then(data => setBoletos(data.map(boleto => ({ ...boleto, isChecked: false, cantidad: 0 }))))
      .catch(error => console.error('Error al obtener los boletos:', error));
  }, []);

  useEffect(() => {
    let suma = 0;
    let totalCantidad = 0;
    boletos.forEach(boleto => {
      if (boleto.isChecked && boleto.cantidad) {
        suma += boleto.cantidad * boleto.precio;
        totalCantidad += boleto.cantidad;
      }
    });
    setTotal(suma);
    setTotalBoletosSeleccionados(totalCantidad);
  }, [boletos]);

  const handleRealizarPedido = async () => {
    try {
      // Verificar autenticación antes de realizar el pedido
      const authResponse = await fetch('http://localhost:8000/api/asistente', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (authResponse.status !== 200) {
        navigate('/loginas');  // Redirigir al usuario a la página de inicio de sesión si no está autenticado
        return;
      }

      const boletosSeleccionados = boletos.filter(boleto => boleto.isChecked);
      const idBoletosSeleccionados = boletosSeleccionados.map(boleto => boleto.id_boleto);
      window.location.href = `/payfinal/?total=${total}&idboleto=${idBoletosSeleccionados}&totalBoletosSeleccionados=${totalBoletosSeleccionados}`;
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
    }
  };

  return (
    <div>
      <h1>Boletos Disponibles</h1>
      <p>Total de boletos a llevar: {totalBoletosSeleccionados}</p>
      <ul>
        {boletos.map(boleto => (
          <li key={boleto.id_boleto}>
            <input
              type="checkbox"
              checked={boleto.isChecked}
              onChange={() => {
                setBoletos(prevBoletos => prevBoletos.map(b => (b.id_boleto === boleto.id_boleto ? { ...b, isChecked: !b.isChecked } : b)));
              }}
            />
            <strong>Tipo:</strong> {boleto.tipo}, 
            <strong> Precio:</strong> ${boleto.precio}, 
            <strong> Stock:</strong> {boleto.stock}
            <strong> Id:</strong> {boleto.id_boleto}
            {boleto.isChecked && (
              <input
                type="number"
                placeholder="Cantidad"
                min="1"
                max={boleto.stock}
                onChange={e => {
                  const cantidad = parseInt(e.target.value, 10);
                  setBoletos(prevBoletos => prevBoletos.map(b => (b.id_boleto === boleto.id_boleto ? { ...b, cantidad } : b)));
                }}
              />
            )}
          </li>
        ))}
      </ul>
      {boletos.some(boleto => boleto.isChecked) && <p>Total a pagar: ${total}</p>}
      {boletos.some(boleto => boleto.isChecked) && <button onClick={handleRealizarPedido}>Realizar Pedido</button>}
    </div>
  );
}

export default BoletosList;
