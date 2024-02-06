import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UncontrolledCarousel } from "reactstrap";
import NavBar from "./navbar";
import FooterHP from "./otros/footerHP";
import "./styles/inicio.css";

function Inicio() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetchDataEvent();
  }, []);

  const fetchDataEvent = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/event", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setEventos(data);
      } else {
        throw new Error("Error al obtener datos del asistente");
      }
    } catch (error) {
      console.error("Error:", error);
      window.location.href = "/loginas";
    }
  };

  const carouselItems = eventos.map((evento) => ({
    alt: evento.nombre_evento,
    caption: evento.nombre_evento,
    key: evento.id_evento,
    src: evento.imagen,
  }));

  return (
    <div>
      <NavBar />
      {/* Carrusel de imágenes */}
      <div className="col-md-10 offset-md-1"
        style={{padding: '10px 0 0 0'}}
      >
        <UncontrolledCarousel
          items={carouselItems}
          interval={2500}
          className="fixed-carousel"
        />
      </div>
      {/* Contenedor de información */}
      <div className="container">
  <div className="info-container">
    <h1>¡Bienvenido a PartyConnect!</h1>
    <p>En PartyConnect, estamos comprometidos a transformar la manera en que planificas, participas y disfrutas de eventos. Nuestra plataforma intuitiva te ofrece la libertad de explorar una amplia variedad de eventos emocionantes, desde fiestas y conciertos hasta conferencias y reuniones sociales. Conéctate con organizadores talentosos, descubre experiencias únicas y crea recuerdos duraderos.</p>
    <div className="image-container">
      <img src="https://i.imgur.com/zMMGfiV.png" alt="PartyConnect" /> 
    </div>
  </div>

  <div className="info-container">
    <h1>Descubre Características Únicas</h1>
    <p>Explora las características que hacen que PartyConnect sea única. Desde una interfaz intuitiva hasta eventos diversos, estamos aquí para ofrecerte experiencias inolvidables.</p>
    <div className="image-container">
      <img src="https://cdn-icons-png.flaticon.com/512/6823/6823088.png" alt="Características Únicas" /> 
    </div>
  </div>

  <div className="info-container">
    <a href="https://liveespochedu-my.sharepoint.com/:b:/g/personal/francisco_alvarez_espoch_edu_ec/EUYvsBYyvlZIvWrrz794q18Bw8YM-z88n3dCxwPqYZgM9Q?e=cRZanl" target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
      <h1>¡Descubre Cómo Usar PartyConnect!</h1>
      <p>Aprende a sacar el máximo provecho de nuestra plataforma con nuestra guía rápida. Descubre funciones ocultas y consejos para optimizar tu experiencia. <br></br><br></br> Haz clic para acceder a la ayuda.</p>
      <div className="image-container">
        <img src="https://cdn-icons-png.flaticon.com/512/6214/6214152.png" alt="Guía de Uso" />
      </div>
    </a>
  </div>

</div>

      <FooterHP />
    </div>
  );
  
};


export default Inicio;
