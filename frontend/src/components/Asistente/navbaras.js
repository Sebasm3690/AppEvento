import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function NavBar() {
  const [asistenteData, setAsistenteData] = useState(null);
  const [eventos, setEventos] = useState([]);

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

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/asistente" className="navbar-brand">
          <img
            src="https://i.imgur.com/19Mo8I4.png"
            alt="PartyConnect"
            style={{ width: '20%', height: 'auto' }}
          />
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/editarperfil" className="navbar-link">
          PERFIL
        </Link>
        <Link to="/historialas" className="navbar-link">
          HISTORIAL DE COMPRAS
        </Link>
        <Link to="/loginas" className="navbar-link" onClick={handleLogout}>
          CERRAR SESIÓN
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;