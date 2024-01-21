import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./navbar";
import Footer from "./footer";
import Carrucel from "./otros/carrucel";
import "./styles/inicio.css";

function Inicio() {
  return (
    <div>
      <NavBar />
      <div className="info-container">
        {/* Información de la aplicación */}
        <h2>Información de la App</h2>
        <p>Texto informativo sobre la aplicación...</p>
      </div>

      <div className="carrucel-container">
        {/* Carrusel de imágenes */}
        <Carrucel />
      </div>
      <Footer />
    </div>
  );
}

export default Inicio;
