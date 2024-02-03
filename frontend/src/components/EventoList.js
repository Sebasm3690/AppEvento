// src/EventosList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBarAsis from "./Asistente/navbaras";
import Footer from "./footer";
import FooterHP from "./otros/footerHP";
import "./styles/inicio.css";
import "./styles/EventosList.css";

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
  const [tipo, setTipo] = useState(""); // Para el filtro de tipo de evento
  const [nombre, setNombreBusqueda] = useState(""); // Para la búsqueda por nombre
  const [mes, setMes] = useState(""); // Para el filtro de mes
  const [ordenamientoMes, setOrdenamientoMes] = useState("asc");
  const [tipomes, setTipomes] = useState("");

  useEffect(() => {
    // Función para obtener los eventos desde tu API
    const fetchEventos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/eventos_activos/"
        );
        setEventos(response.data.eventos);
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

  const buscarEventos = async () => {
    try {
      // Determinar el ordenamiento basado en la opción seleccionada
      let ordenamiento = "asc"; // Por defecto, ascendente
      if (tipomes === "Mesmenm") {
        ordenamiento = "desc"; // Si se selecciona "Mes (De mayor a menor)", descendente
      } else {
        ordenamiento = "asc";
      }

      const response = await axios.get(
        `http://localhost:8000/api/eventoslist/`,
        {
          params: {
            tipo: tipo,
            nombre: nombre,
            //mes: mes !== "Todo" ? mes : null,
            ordenamiento: ordenamiento, // Utilizar el ordenamiento determinado
          },
        }
      );
      setEventos(response.data);
    } catch (error) {
      console.error("Error en la búsqueda de eventos:", error);
    }
  };

  return (
    <>
      <NavBarAsis />
      <div className="container my-4">
        <div className="row mb-3">
          <div className="col-sm-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre..."
              value={nombre}
              onChange={(e) => setNombreBusqueda(e.target.value)}
            />
          </div>
          <div className="col-sm-12 col-md-3">
            <select
              className="custom-select"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="Publico">Público</option>
              <option value="Privado">Privado</option>
            </select>
          </div>
          <div className="col-sm-12 col-md-3">
            <select
              className="custom-select"
              value={tipomes}
              onChange={(e) => setTipomes(e.target.value)}
            >
              <option value="Todo">Todo el año</option>
              <option value="Mesmenm">Mes (De mayor a menor)</option>
              <option value="Mesmam">Mes (De menor a mayor)</option>
            </select>
          </div>
          <div className="col-sm-12 col-md-2">
            <button className="btn btn-primary" onClick={buscarEventos}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/64/64673.png"
                alt="Buscar"
                width={"25px"}
              />
            </button>
          </div>
        </div>

        <div className="container">
          <div className="row justify-content-center mt-3">
            {eventos
              .filter((evento) => !evento.eliminado)
              .map((evento) => (
                <div
                  key={evento.id_evento}
                  className="evento-column mb-4 d-flex justify-content-center"
                >
                  <div className="card h-100" style={{ maxWidth: "300px" }}>
                    {" "}
                    {/* Establecer un ancho máximo para la tarjeta */}
                    <img
                      src={evento.imagen}
                      className="card-img-top"
                      alt={evento.nombre_evento}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-center">
                        {evento.nombre_evento}
                      </h5>
                      <p className="card-text">{evento.descripcion}</p>
                      <p className="card-text">{evento.ubicacion}</p>
                      <p className="card-text">
                        <small className="text-muted">{evento.fecha}</small>
                      </p>
                      <div className="mt-auto">
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => handleMostrarDatos(evento)}
                        >
                          Ver Más Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Modal isOpen={showModal}>
        <ModalHeader>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: 0 }}>INFORMACIÓN DEL EVENTO</h3>
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
            <label style={{ fontWeight: "bold" }}>Evento:</label>
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
            <label style={{ fontWeight: "bold" }}>Fecha:</label>
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
            <label style={{ fontWeight: "bold" }}>Hora:</label>
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
            <label style={{ fontWeight: "bold" }}>Ubicación:</label>
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
            <label style={{ fontWeight: "bold" }}>Descripción:</label>
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
          <div className="row">
            <div className="col-md-6">
              <Link
                to={`/verboletos/${id_evento}`}
                className="btn btn-primary"
                style={{
                  backgroundColor: "#3498db",
                  borderColor: "#3498db",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                COMPRAR
              </Link>
            </div>
            <div className="col-md-6">
              <Button
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#d32f2f",
                  borderColor: "#d32f2f",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                CANCELAR
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      <Footer />
    </>
  );
}

export default EventosList;