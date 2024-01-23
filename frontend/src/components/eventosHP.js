import React, { useState, useEffect } from "react"; // Importa React y los hooks necesarios
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import { show_alerta } from "../functions";
import { set } from "react-hook-form";

import NavBar from "./navbar";
import Footer from "./footer";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id_evento, setId_evento] = useState(0);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState(0);
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    // Función para obtener los eventos desde tu API
    const fetchEventos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/vereven/");
        setEventos(response.data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    // Llamar a la función para obtener eventos al montar el componente
    fetchEventos();
  }, []);

  function handleMostrarDatos(evento) {
    setFecha(evento.fecha);
    setHora(evento.hora);
    setUbicacion(evento.ubicacion);
    setDescripcion(evento.descripcion);
    setId_evento(evento.id_evento);
    setShowModal(true);
  }

  return (
    <div>
      <NavBar />
      <>
      <div style={{ padding: '50px 700px 20px 700px'}}>
        <h1 style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#3498db', color: '#ffffff', textAlign: "center" }}>NUESTROS EVENTOS</h1>
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {eventos
          .filter((evento) => evento.eliminado !== true)
          .map((evento) => (
            <div
              key={evento.id_evento}
              style={{ width: "20%", margin: "10px" }}
            >
              <div className="card">
                <img
                  src={evento.imagen}
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <center>
                    <h5 className="card-title">{evento.nombre_evento}</h5>
                  </center>
                  <p className="card-text">{evento.descripcion}</p>
                  <p className="card-text">{evento.ubicacion}</p>
                  <p className="card-text">
                    <small className="text-muted">{evento.fecha}</small>
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Footer />
      </>
    </div>
  );
}

export default Eventos;
