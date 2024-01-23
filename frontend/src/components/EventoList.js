// src/EventosList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBarAsis from "./Asistente/navbaras";
import Footer from "./footer";
import "./styles/inicio.css";

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

function EventosList() {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id_evento, setId_evento] = useState(0);
  const [fecha, setFecha] = useState("");
  const [nombre_evento, setNombre] = useState("");
  const [hora, setHora] = useState(0);
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

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
    setNombre(evento.nombre_evento);
    setImagen(evento.imagen);
    setShowModal(true);
  }

  return (
    <>
     <NavBarAsis /><br></br>
     <h1 className="display-4 text-center mb-4">LISTADO DE EVENTOS</h1>
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
                  src= {evento.imagen}
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">{evento.nombre_evento}</h5>
                  <p className="card-text">{evento.descripcion}</p>
                  <p className="card-text">
                    <small className="text-muted">{evento.fecha}</small>
                  </p>
                  <Button
                    color="primary"
                    onClick={(e) => handleMostrarDatos(evento)}
                    >
                      Detalles del Evento
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/*Ventana modal*/}

      <Modal isOpen={showModal}>
        <ModalHeader>
          <div>
            <h3>Información del evento</h3>
          </div>
        </ModalHeader>

        {imagen && (
          <img
            src={imagen}
            alt="Imagen de vista previa"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}

        <ModalBody>
          <FormGroup>
            <label>Nombre del Evento:</label>
            <input
              className="form-control"
              readOnly
              name="id"
              type="text"
              onChange={(e) => setNombre(e.target.value)}
              value={nombre_evento}
            />
          </FormGroup>
          <FormGroup>
            <label>Fecha:</label>
            <input
              className="form-control"
              readOnly
              name="fecha"
              type="date"
              onChange={(e) => setFecha(e.target.value)}
              value={fecha}
            />
          </FormGroup>

          <FormGroup>
            <label>Hora:</label>
            <input
              className="form-control"
              readOnly
              name="hora"
              type="text"
              onChange={(e) => setHora(e.target.value)}
              value={hora}
            />
          </FormGroup>

          <FormGroup>
            <label>Ubicacion:</label>
            <input
              className="form-control"
              readOnly
              name="ubicacion"
              type="text"
              onChange={(e) => setUbicacion(e.target.value)}
              value={ubicacion}
            />
          </FormGroup>

          <FormGroup>
            <label>Descripcion:</label>
            <input
              className="form-control"
              readOnly
              name="descripcioin"
              type="text"
              onChange={(e) => setDescripcion(e.target.value)}
              value={descripcion}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Link to={`/verboletos/${id_evento}`} className="btn btn-primary">
            Comprar Boletos
          </Link>
          <Button color="warning" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Footer />  
    </>
  );
}

export default EventosList;
