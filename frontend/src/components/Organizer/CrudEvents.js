import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import { show_alerta } from "../../functions";

import "../styles/organizerStyles.css";

const CrudEvents = ({ organizerObj }) => {
  const url = "http://127.0.0.1:8000/api/v1/event/";
  const url_boleto = "http://127.0.0.1:8000/api/v1/ticket/";
  /*Evento */
  const [events, setEvents] = useState([]);
  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  /*Boleto*/
  const [boletos, setBoletos] = useState([]);
  const [idBoleto, setIdBoleto] = useState(0);
  const [stock, setStock] = useState(0);
  const [tipoBoleto, setTipoBoleto] = useState("");
  const [precio, setPrecio] = useState(0);

  const [limite, setLimite] = useState(0);
  //const [image, setImage] = useState("");
  const [id_organizador, setIdOrganizador] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalInsert, setShowModalInsert] = useState(false);
  const [showModalBoleto, setShowModalBoleto] = useState(false);
  const [showModalBoletoIngresar, setShowModalBoletoIngresar] = useState(false);

  //Función para consumir API y obtener todo el objeto {}

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    const respuesta = await axios.get(url);
    setEvents(respuesta.data);
    /*const respuestaBoleto = await axios.get(url_boleto);
    setBoletos(respuestaBoleto.data);*/
  };

  console.log("Datos del evento en mi proyectos:", events);

  const handleEditarBoleto = (ticketId) => {
    const ticket = boletos.find((boleto) => boleto.id_evento === ticketId);
    if (ticket) {
      setIdBoleto(boletos.id_boleto);
      setStock(boletos.stock);
      setTipoBoleto(boletos.tipo);
      setPrecio(boletos.precio);
    }
  };

  const handleEditarEvento = (eventId) => {
    const evento = events.find((event) => event.id_evento === eventId);
    if (evento) {
      setId(evento.id_evento);
      setNombre(evento.nombre_evento);
      setFecha(evento.fecha);
      setHora(evento.hora);
      setUbicacion(evento.ubicacion);
      setDescripcion(evento.descripcion);
      setTipo(evento.tipo);
      setLimite(evento.limite);
      //setImage(evento.image);
      setIdOrganizador(evento.id_organizador);
    }

    setShowModal(true);
  };

  /*const handleEliminarEvento = async (eventId) => {
    //You must put async when you use await
    const evento = events.find((event) => event.id_evento === eventId);
    if (evento) {
      //Solicitud para el borrado lógico
      await axios.post(`http://127.0.0.1:8000/borrado_logico/${userId}/`);
      //Acutalizar lista de organizadores despues del borrado lógico
      setOrganizers((prevOrganizadores) =>
        prevOrganizadores.filter((o) => o.id_organizador !== userId)
      );
    }
  };*/

  /*Imágen*/

  /*const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      axios
        .post("http://127.0.0.1:8000/api/v1/upload/", formData)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);
          setImage(response.data.url); // Asume que el servidor devuelve la URL de la imagen
        })
        .catch((error) => {
          console.error("Error al cargar la imagen:", error);
        });
    }
  };*/

  const validarBoletoEditar = async (op) => {
    setShowModalBoleto(false);
    setShowModalBoletoIngresar(false);
    var parametros;
    if (stock === 0) {
      show_alerta("Escribe si hay stock dosponible", "warning");
    } else if (tipo === "") {
      show_alerta("Escribe el tipo de boleto", "warning");
    } else if (precio === 0) {
      show_alerta("Escribe el precio del boleto", "warning");
    }

    parametros = {
      stock: stock,
      tipo: tipo,
      precio: precio,
    };

    axios
      .put(url_boleto, parametros)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        show_alerta("El boleto ha sido agregado exitosamente", "success");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST:", error);
      });
  };

  const validarBoletoIngresar = async (op) => {
    setShowModalBoletoIngresar(false);
    setShowModalBoleto(false);
    var parametros;
    if (stock === 0) {
      show_alerta("Escribe si hay stock dosponible", "warning");
    } else if (tipo === "") {
      show_alerta("Escribe el tipo de boleto", "warning");
    } else if (precio === 0) {
      show_alerta("Escribe el precio del boleto", "warning");
    }

    parametros = {
      stock: stock,
      tipo: tipo,
      precio: precio,
    };

    // Convertir el objeto a una cadena JSON
    const parametrosString = JSON.stringify(parametros, null, 2);

    // Mostrar un alert con la información del objeto
    alert(parametrosString);

    axios
      .post(url_boleto, parametros)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        show_alerta("El boleto ha sido agregado exitosamente", "success");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST:", error);
      });
  };

  const validar = async (op) => {
    setShowModal(false);

    var parametros;
    const urlEditar = `http://127.0.0.1:8000/api/v1/event/${id}/`;
    //var metodo;
    if (nombre.trim() === "") {
      show_alerta("Escribe el nombre del evento", "warning");
    } else if (fecha === "") {
      show_alerta("Escribe la fecha del evento", "warning");
    } else if (!hora || hora.trim().length === 0) {
      show_alerta("Escribe la hora del evento", "warning");
    } else if (ubicacion.trim() === "") {
      show_alerta("Escribe la ubicación del evento", "warning");
    } else if (descripcion.trim() === "") {
      show_alerta("Escribe la descripción del evento", "warning");
    } else if (tipo.trim() === "") {
      show_alerta("Escribe el tipo de evento", "warning");
    } else if (limite === 0) {
      show_alerta("Escribe el limite del evento", "warning");
      //} else if (image === "") {
      //show_alerta("Agrega una imágen al evento", "warning");
    } else if (id_organizador === "") {
      show_alerta("Escribe el  nombre del organizador", "warning");
    }
    setShowModalInsert(false);
    setShowModalBoleto(true);

    if (op === 1) {
      parametros = {
        nombre_evento: nombre.trim(),
        fecha,
        hora,
        ubicacion: ubicacion.trim(),
        descripcion: descripcion.trim(),
        tipo: tipo.trim(),
        limite,
        //image,
        id_organizador,
      };

      // Convertir el objeto a una cadena JSON
      //const parametrosString = JSON.stringify(parametros, null, 2);

      // Mostrar un alert con la información del objeto
      //alert(parametrosString);

      //metodo = "POST";
      console.log("Parámetros que se enviarán:", parametros);
      axios
        .post(url, parametros)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);
          show_alerta("El evento ha sido agregado exitosamente", "success");
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud POST:", error);
        });
    } else {
      alert(id);
      parametros = {
        nombre_evento: nombre.trim(),
        fecha,
        hora,
        ubicacion: ubicacion.trim(),
        descripcion: descripcion.trim(),
        tipo: tipo.trim(),
        limite,
        //image,
        id_organizador,
      };
      //metodo = "PUT";

      axios
        .put(urlEditar, parametros)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);
          show_alerta("El evento ha sido actualizado exitosamente", "success");
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud PUT:", error);
        });
    }
    //enviarSolicitud(metodo, parametros);
  };

  //Se coloca asyn cuando se tienen parámetros
  /*const enviarSolicitud = async (metodo, parametros) => {
    await axios({
      method: metodo,
      url: url,
      data: parametros,
    })
      .then(function (respuesta) {
        var tipo = respuesta.data[0];
        var msj = respuesta.data[1];
        show_alerta(msj.tipo);
        if (tipo === "success") {
          setShowModal(false);
          setShowModalInsert(false);
        }
      })
      .catch(function (error) {
        show_alerta("Error en la solicitud", "error");
        console.error("Response error:", error.response);
      });
  };*/

  return (
    <>
      <Container className="meetup-item">
        <button
          className="btn btn-primary"
          onClick={() => setShowModalInsert(true)}
        >
          Agregar evento nuevo
        </button>
        <br></br>
        <Table className="table">
          <thead>
            <tr>
              <th>Id_evento</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Ubicacion</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Limite</th>
              {/*<th>Imágen</th>*/}
              <th>id_organizador</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {events
              .filter(
                (event) => event.id_organizador === organizerObj.id_organizador
              )
              .map((event) => (
                <tr key={event.id_evento}>
                  <td>{event.id_evento}</td>
                  <td>{event.nombre_evento}</td>
                  <td>{event.fecha}</td>
                  <td>{event.hora}</td>
                  <td>{event.ubicacion}</td>
                  <td>{event.descripcion}</td>
                  <td>{event.tipo}</td>
                  <td>{event.limite}</td>

                  {/*}<td>
                    {" "}
                    {image && (
                      <img
                        src={event.image}
                        alt="Imagen de vista previa"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    )}
                    </td>*/}
                  <td>{event.id_organizador}</td>
                  <td>
                    <button
                      onClick={() => handleEditarEvento(event.id_evento)}
                      className="btn btn-warning"
                    >
                      Editar
                    </button>{" "}
                    <button
                      className="btn btn-danger"
                      //onClick={() => handleEliminarEvento(event.id_evento)}
                    >
                      Dar de baja
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>

      {/*Ventana modal*/}

      <Modal isOpen={showModal}>
        <ModalHeader>
          <div>
            <h3>Editar Organizador</h3>
          </div>
        </ModalHeader>

        {/* Vista previa de la imagen }

        {image && (
          <img
            src={image}
            alt="Imagen de vista previa"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}

        {----------------------------*/}

        <ModalBody>
          <FormGroup>
            <label>Id:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_evento" //e es nuestro evento o lo que ingresa el usuario, con target apuntamos al valor ingresado por el usuario y se actualiza el objeto gracias al método set
              value={id}
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre_evento"
              type="text"
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Fecha:</label>
            <input
              className="form-control"
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
              name="hora"
              type="time"
              onChange={(e) => setHora(e.target.value)}
              value={hora}
            />
          </FormGroup>

          <FormGroup>
            <label>Ubicacion:</label>
            <input
              className="form-control"
              name="ubicacion"
              type="text"
              onChange={(e) => setUbicacion(e.target.value)}
              value={ubicacion}
            />
          </FormGroup>

          <FormGroup>
            <label>tipo:</label>
            <input
              className="form-control"
              name="tipo"
              type="text"
              onChange={(e) => setTipo(e.target.value)}
              value={tipo}
            />
          </FormGroup>

          <FormGroup>
            <label>Descripcion:</label>
            <input
              className="form-control"
              name="descripcion"
              type="text"
              onChange={(e) => setDescripcion(e.target.value)}
              value={descripcion}
            />
          </FormGroup>

          <FormGroup>
            <label>limite:</label>
            <input
              className="form-control"
              name="limite"
              type="number"
              onChange={(e) => setLimite(e.target.value)}
              value={limite}
            />
          </FormGroup>

          {/*<FormGroup>
            <label>Imágen:</label>
            <input
              className="form-control"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
      </FormGroup>*/}

          <FormGroup>
            <label>Id_organizador:</label>
            <input
              className="form-control"
              name="id_organizador"
              type="text"
              onChange={(e) => setIdOrganizador(e.target.value)}
              value={id_organizador}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validar(2)}>
            Siguiente
          </Button>
          <Button color="danger" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      {/*-------------Insertar Evento---------------- */}

      <Modal isOpen={showModalInsert}>
        <ModalHeader>
          <div>
            <h3>Insertar Evento</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_evento" //e es nuestro evento o lo que ingresa el usuario, con target apuntamos al valor ingresado por el usuario y se actualiza el objeto gracias al método set
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre_evento"
              type="text"
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Fecha:</label>
            <input
              className="form-control"
              name="fecha"
              type="date"
              onChange={(e) => setFecha(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Hora:</label>
            <input
              className="form-control"
              name="hora"
              type="time"
              onChange={(e) => setHora(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Ubicacion:</label>
            <input
              className="form-control"
              name="ubicacion"
              type="text"
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Descripcion:</label>
            <input
              className="form-control"
              name="descripcion"
              type="text"
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>tipo:</label>
            <input
              className="form-control"
              name="tipo"
              type="text"
              onChange={(e) => setTipo(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>limite:</label>
            <input
              className="form-control"
              name="limite"
              type="number"
              onChange={(e) => setLimite(e.target.value)}
            />
          </FormGroup>

          {/*<FormGroup>
            <label>Imágen:</label>
            <input
              className="form-control"
              name="image"
              type="file"
              accept="image/"
              onChange={handleImageUpload}
            />
    </FormGroup>*/}

          <FormGroup>
            <label>Id_organizador:</label>
            <input
              className="form-control"
              name="id_organizador"
              type="text"
              onChange={(e) => setIdOrganizador(e.target.value)}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validar(1)}>
            Siguiente
          </Button>
          <Button
            className="btn btn-danger"
            onClick={() => setShowModalInsert(false)}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Modal Boleto Editar-------------------*/}

      {/*Ventana modal*/}

      <Modal isOpen={showModalBoleto}>
        <ModalHeader>
          <div>
            <h3>Editar Boleto</h3>
          </div>
        </ModalHeader>

        {/* Vista previa de la imagen }

        {image && (
          <img
            src={image}
            alt="Imagen de vista previa"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}

        {----------------------------*/}

        <ModalBody>
          <FormGroup>
            <label>Id:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_evento" //e es nuestro evento o lo que ingresa el usuario, con target apuntamos al valor ingresado por el usuario y se actualiza el objeto gracias al método set
              value={idBoleto}
            />
          </FormGroup>

          <FormGroup>
            <label>Stock:</label>
            <input
              className="form-control"
              name="nombre_evento"
              type="text"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
            />
          </FormGroup>
          <FormGroup>
            <label>Tipo:</label>
            <input
              className="form-control"
              name="fecha"
              type="text"
              onChange={(e) => setTipoBoleto(e.target.value)}
              value={tipoBoleto}
            />
          </FormGroup>
          <FormGroup>
            <label>Precio:</label>
            <input
              className="form-control"
              name="hora"
              type="money"
              onChange={(e) => setPrecio(e.target.value)}
              value={precio}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validarBoletoEditar()}>
            Finalizar
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Modal Boleto Ingresar-------------------*/}

      {/*Ventana modal*/}

      <Modal isOpen={showModalBoleto}>
        <ModalHeader>
          <div>
            <h3>Ingresar Boleto</h3>
          </div>
        </ModalHeader>

        {/* Vista previa de la imagen }

        {image && (
          <img
            src={image}
            alt="Imagen de vista previa"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}

        {----------------------------*/}

        <ModalBody>
          <FormGroup>
            <label>Id:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_evento" //e es nuestro evento o lo que ingresa el usuario, con target apuntamos al valor ingresado por el usuario y se actualiza el objeto gracias al método set
              value={idBoleto}
            />
          </FormGroup>

          <FormGroup>
            <label>Stock:</label>
            <input
              className="form-control"
              name="nombre_evento"
              type="text"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
            />
          </FormGroup>
          <FormGroup>
            <label>Tipo:</label>
            <input
              className="form-control"
              name="fecha"
              type="text"
              onChange={(e) => setTipoBoleto(e.target.value)}
              value={tipoBoleto}
            />
          </FormGroup>
          <FormGroup>
            <label>Precio:</label>
            <input
              className="form-control"
              name="hora"
              type="money"
              onChange={(e) => setPrecio(e.target.value)}
              value={precio}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validarBoletoIngresar()}>
            Finalizar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CrudEvents;
