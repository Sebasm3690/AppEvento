import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ComprasAsistente() {
  const [compras, setCompras] = useState([]);
  const token = localStorage.getItem('jwt'); // Aquí, no estamos usando useState para token

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!token) {
      // Redirige al usuario a la página de inicio de sesión si no está autenticado
      window.location.href = '/loginas'; 
    } else {
      // Suponiendo que el token JWT contiene directamente el ID del asistente (ajusta esto según la estructura de tu token)
      const asistenteId = token; // Esto es solo un ejemplo; necesitarás adaptarlo según tu token

      // Configura las cabeceras HTTP con el token JWT
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Incorpora el ID del asistente en la URL de la API
      axios.get(`http://127.0.0.1:8000/historial-compras/1`, config)
        .then(response => {
          setCompras(response.data);
        })
        .catch(error => {
          console.error('Error al obtener las órdenes de compra:', error);
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Mis Compras</h1>
      <ul>
        {compras.map(compra => (
          <li key={compra.num_orden}>
            Orden: {compra.num_orden}, Valor: {compra.valor_total}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ComprasAsistente;
