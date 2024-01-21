import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UncontrolledCarousel } from "reactstrap";
import NavBar from "./navbar";
import Footer from "./footer";
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
    altText: evento.nombre_evento,
    caption: evento.descripcion,
    key: evento.id_evento,
    src: evento.imagen,
  }));

  return (
    <div>
      <NavBar />  
      <div style={{ display: 'flex', marginLeft: '60px', marginTop: '80px' }}>
        <div className="info-container" style={{ textAlign: "center", flex: 1 }}>
          <h1>¡Bienvenido a PartyConnect!</h1>
          <p>En PartyConnect, estamos comprometidos a transformar la manera en que planificas, participas y disfrutas de eventos. Nuestra plataforma intuitiva te ofrece la libertad de explorar una amplia variedad de eventos emocionantes, desde fiestas y conciertos hasta conferencias y reuniones sociales. Conéctate con organizadores talentosos, descubre experiencias únicas y crea recuerdos duraderos.</p>
          <br></br>
          <div>
            <img src="https://media.revistagq.com/photos/62a8546d6b74c0e2031238a6/1:1/w_770,h_770,c_limit/buzz.jpg" alt="PartyConnect" style={{ width: '50%', height: 'auto' }} /> 
          </div>
        </div>
    
        <div className="carrucel-container">
          {/* Carrusel de imágenes */}
          <h1 style={{ textAlign: "center" }}>EVENTOS PRÓXIMOS</h1>
          <div className="container mt-5">
            <div className="col-md-10 offset-md-1">
              <UncontrolledCarousel
                items={carouselItems}
                interval={2000}
              ></UncontrolledCarousel>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};


export default Inicio;
