import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UncontrolledCarousel } from "reactstrap";
import EditarPerfil from "./Asistente/editarPerfil";

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
    src: "https://picsum.photos/id/123/1200/600",
  }));

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/asistente">
            Inicio
          </a>
          <a className="navbar-brand" href="/editarPerfil">
            Editar Perfil
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="col-md-6 offset-md-3">
          {asistenteData && (
            <>
              <p className="mb-3">
                Bienvenido, {asistenteData.nombre} {asistenteData.apellido}.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container mt-5">
        <div className="col-md-10 offset-md-1">
          <UncontrolledCarousel
            items={carouselItems}
            interval={1500}
            //style={{ maxWidth: "1000px", maxHeight: "100px" }}
          ></UncontrolledCarousel>
        </div>

        <Link to={`/meventos/`}>Ver Eventos</Link>
        <br />
        <Link to={`/historialas/`}>Ver Compras</Link>
      </div>
    </div>
  );
};

export default Asistente;
