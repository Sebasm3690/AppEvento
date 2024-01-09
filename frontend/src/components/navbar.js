// NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css"; 

function NavBar() {
  return (
    <nav className="navbar-container">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            Inicio
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/loginadm" className="navbar-link">
            Administrador
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/loginorg" className="navbar-link">
            Organizador
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/loginas" className="navbar-link">
            Asistente
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;