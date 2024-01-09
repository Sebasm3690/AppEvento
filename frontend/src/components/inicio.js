import React from "react";
import { Link } from "react-router-dom";
import "./styles/inicio.css"; 

function Inicio() {
    return (
      <div className="inicio-container">
        <div className="bienvenida">
            <h1>Bienvenido a PartyConnect!</h1>
            <p>Conéctate y organiza eventos de manera fácil y divertida.</p>
        </div>

        <div className="inicio-item">
          <div className="rol-info">
            <h2>Administrador</h2>
            <p>Gestión de Organizadores.</p>
          </div>
          <Link to="/loginadm" className="inicio-button">
            Ingresar
          </Link>
        </div>
        <div className="inicio-item">
          <div className="rol-info">
            <h2>Organizador</h2>
            <p>Gestión de Eventos.</p>
          </div>
          <Link to="/loginorg" className="inicio-button">
            Ingresar
          </Link>
        </div>
        <div className="inicio-item">
          <div className="rol-info">
            <h2>Asistente</h2>
            <p>Participación en eventos.</p>
          </div>
          <Link to="/loginas" className="inicio-button">
            Ingresar
          </Link>
        </div>
      </div>
    );
  }
  
  export default Inicio;