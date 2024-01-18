// src/EventosList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function EventosList() {
  const [eventos, setEventos] = useState([]);

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

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Listado de Eventos</h1>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {eventos
          .filter((evento) => evento.eliminado !== true)
          .map((evento) => (
            <div
              key={evento.id_evento}
              style={{ width: "20%", margin: "10px" }}
            >
              <div className="card">
                <img
                  src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/party-night-banner-design-template-9c9d0ee04d93c1e567f473f6a683c61c_screen.jpg?ts=1610236562"
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">{evento.nombre_evento}</h5>
                  <p className="card-text">{evento.descripcion}</p>
                  <p className="card-text">
                    <small className="text-muted">{evento.fecha}</small>
                  </p>
                  <Link
                    to={`/meventos/eventonum/${evento.id_evento}`}
                    className="btn btn-primary"
                  >
                    Ver más detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default EventosList;
