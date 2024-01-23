import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function NavBar() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/userv/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setAdminData(data);
      } else {
        throw new Error("Error al obtener datos del administrador");
      }
    } catch (error) {
      console.error("Error:", error);
      window.location.href = "/loginadm/";
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 200) {
        localStorage.removeItem("jwt");
        window.location.href = "/loginadm/";
      } else {
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboardadm" className="navbar-brand">
          <img
            src="https://i.imgur.com/19Mo8I4.png"
            alt="PartyConnect"
            style={{ width: '20%', height: 'auto' }}
          />
        </Link>
      </div>
      <div className="centered-panel">
        <Link to="/dashboardadm" className="navbar-brand">
          PANEL ADMINISTRADOR
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/loginas" className="navbar-link" onClick={handleLogout}>
          CERRAR SESIÓN
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
