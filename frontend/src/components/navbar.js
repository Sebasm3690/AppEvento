// NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css"; 

function NavBar() {
  return (
    <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img src="https://i.imgur.com/19Mo8I4.png" alt="PartyConnect" style={{ width: '20%', height: 'auto' }} /> 
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/eventosHP" className="navbar-link">
            EVENTOS
          </Link>
          <Link to="/quienes-somos" className="navbar-link">
            QUIÉNES SOMOS
          </Link>
          <Link to="/loginorg" className="navbar-link">
            ORGANIZADORES
          </Link>
          <Link to="/loginas" className="navbar-link">
            INICIA SESIÓN
          </Link>
        </div>
      </nav>
  );
}

export default NavBar;