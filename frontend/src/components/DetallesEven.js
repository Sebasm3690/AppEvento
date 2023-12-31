// src/components/EventoDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function EventoDetail() {
    const [evento, setEvento] = useState(null);
    const { id } = useParams();  // Obtener el ID del evento desde la URL
  
    useEffect(() => {
      const fetchEvento = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/lista/evendet/${id}/`);
          setEvento(response.data);
        } catch (error) {
          console.error('Error al obtener el evento:', error);
        }
      };
  
      fetchEvento();
    }, [id]);  // Dependencia para re-cargar el efecto cuando cambie el ID
  
    if (!evento) return <p>Cargando...</p>;
  
    return (
      <div>
        <h1>{evento.nombre_evento}</h1>
        <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> {evento.hora}</p>
        <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
        <p><strong>Descripción:</strong> {evento.descripcion}</p>
        <Link to={`/verboletos/`}>Comprar</Link>
      </div>
    );
}

export default EventoDetail;
