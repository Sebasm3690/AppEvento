import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UncontrolledCarousel } from "reactstrap";
import EditarPerfil from "./Asistente/editarPerfil";
import NavBarAsis from "./Asistente/navbaras";
import Footer from "./footer";
import "./styles/inicio.css";


const Asistente = () => {
  const [asistenteData, setAsistenteData] = useState(null);
  const [eventos, setEventos] = useState([]);
  var arrayEnFormatoJson;
  useEffect(() => {
    fetchData();
    fetchDataEvent();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/asistente", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setAsistenteData(data);
      } else {
        throw new Error("Error al obtener datos del asistente");
      }
    } catch (error) {
      console.error("Error:", error);
      window.location.href = "/loginas";
    }
  };

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

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logoutAs", {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 200) {
        localStorage.removeItem("jwt");
        window.location.href = "/loginas";
      } else {
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const carouselItems = eventos.map((evento) => ({
    altText: evento.nombre_evento,
    caption: evento.descripcion, // Puedes cambiar esto según tus necesidades
    key: evento.id_evento,
    src: evento.imagen,
  }));

  return (
    <div>
      <NavBarAsis />  
      <div className="inicio-container">
        <div className="container mt-5">
          <div className="col-md-6 offset-md-3">

            {asistenteData && (
              <p className="welcome-message text-center" style={{ color: 'black', fontSize: '30px', fontFamily: 'Cambria' }}>
                Bienvenido, {asistenteData.nombre} {asistenteData.apellido}.
              </p>
            )}

            <div className="col-md-10 offset-md-1">
              <br />
              <UncontrolledCarousel
                items={carouselItems}
                interval={1500}
              />
            </div>

            <div className="button-container text-center">
              <Link to={`/meventos/`} className="btn btn-primary custom-btn">
                Ver Eventos
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />  
    </div>
  );
};

export default Asistente;
