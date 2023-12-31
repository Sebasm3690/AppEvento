// src/EventosList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EventosList() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Función para obtener los eventos desde tu API
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/vereven/');
        setEventos(response.data);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    // Llamar a la función para obtener eventos al montar el componente
    fetchEventos();
  }, []);

  return (
    <div>
      <h1>Listado de Eventos</h1>
      <ul>
        {eventos.map((evento) => (
          <li key={evento.id_evento}>
            <h2>{evento.nombre_evento}</h2>
            <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}</p>
            <p><strong>Hora:</strong> {evento.hora}</p>
            <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
            <p><strong>Descripción:</strong> {evento.descripcion}</p>
            <p><strong>Tipo:</strong> {evento.tipo}</p>
            <p><strong>Limite:</strong> {evento.limite}</p>
            <Link to={`/meventos/eventonum/${evento.id_evento}`}>Ver detalles</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventosList;
