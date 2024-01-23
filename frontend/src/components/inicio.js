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
    alt: evento.nombre_evento,
    caption: evento.nombre_evento,
    key: evento.id_evento,
    src: evento.imagen,
  }));

  return (
    <div>
      <NavBar />  
      <div style={{ display: 'flex', marginLeft: '60px', marginTop: '80px' }}>
        <div className="info-container" style={{ backgroundColor: '#dfece6', textAlign: "center", flex: 1, borderRadius: '50px'}}>
          <h1>¡Bienvenido a PartyConnect!</h1> <br></br>
          <p>En PartyConnect, estamos comprometidos a transformar la manera en que planificas, participas y disfrutas de eventos. Nuestra plataforma intuitiva te ofrece la libertad de explorar una amplia variedad de eventos emocionantes, desde fiestas y conciertos hasta conferencias y reuniones sociales. Conéctate con organizadores talentosos, descubre experiencias únicas y crea recuerdos duraderos.</p>
          <div>
            <img src="https://i.imgur.com/zMMGfiV.png" alt="PartyConnect" style={{ width: '80%', height: 'auto' }} /> 
          </div>
        </div>
    
        <div className="carrucel-container">
          {/* Carrusel de imágenes */}
          <h1 style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#3498db', color: '#ffffff', textAlign: "center", borderRadius: '50px'}}>PRÓXIMOS EVENTOS</h1>
          <div className="container mt-5">
            <div className="col-md-10 offset-md-1">
              <UncontrolledCarousel
                items={carouselItems}
                interval={2500}
                className="fixed-carousel" 
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
