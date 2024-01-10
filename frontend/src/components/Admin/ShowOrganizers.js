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

const ShowOrganizers = ({ adminObj }) => {
  const botonDerechaStyles = {
    marginLeft: "auto",
  };

  console.log("Datos del organizador en CrudEvents:", adminObj);
  const url = "http://127.0.0.1:8000/api/v1/organizer/";
  const [organizers, setOrganizers] = useState([]);
  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [ci, setCi] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [id_admin, setId_admin] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalInsert, setShowModalInsert] = useState(false);
  const [showModalRecuperar, setShowModalRecuperar] = useState(false);

  //Función para consumir API y obtener todo el objeto {}

  useEffect(() => {
    getOrganizers();
  }, []);

  const getOrganizers = async () => {
    const respuesta = await axios.get(url);
    setOrganizers(respuesta.data);
  };

  console.log("Datos del organizador de:", organizers);

  const handleEditarUsuario = (userId) => {
    const organizador = organizers.find(
      (organizer) => organizer.id_organizador === userId
    );
    if (organizador) {
      setId(organizador.id_organizador);
      setNombre(organizador.nombre);
      setApellido(organizador.apellido);
      setCi(organizador.ci);
      setCorreo(organizador.correo);
      setContrasenia(organizador.contrasenia);
      setId_admin(organizador.id_admin);
    }

    setShowModal(true);
  };

  const recuperar_organizador = async (id_organizador) => {
    await axios.post(
      `http://127.0.0.1:8000/recuperar_organizador/${id_organizador}/`,
      show_alerta("El organizador ha sido recuperado correctamente", "success")
    );
    setOrganizers((prevOrganizadores) =>
      prevOrganizadores.filter(
        (prevOrganizador) => prevOrganizador.id_organizador !== id_organizador
      )
    );
  };

  const handleEliminarUsuario = async (userId) => {
    //Solicitud para el borrado lógico
    await axios.post(
      `http://127.0.0.1:8000/borrado_logico_organizador/${userId}/`,
      show_alerta("El organizador ha sido dado de baja", "success")
    );
    //Acutalizar lista de organizadores despues del borrado lógico
    setOrganizers((prevOrganizadores) =>
      prevOrganizadores.filter((o) => o.id_organizador !== userId)
    );
  };

  const handleRecuperar = async () => {
    setShowModalRecuperar(true);
  };

  const validar = async (op) => {
    // Expresión regular para validar el formato de correo electrónico
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var parametros;

    const urlEditar = `http://127.0.0.1:8000/api/v1/organizer/${id}/`;
    //var metodo;
    if (nombre.trim() === "") {
      show_alerta("Escribe el nombre del organizador", "warning");
    } else if (apellido.trim() === "") {
      show_alerta("Escribe el apellido del organizador", "warning");
    } else if (ci.trim() === "") {
      show_alerta("Escribe la cédula del organizador", "warning");
    } else if (correo.trim() === "") {
      show_alerta("Escribe el correo del organizador", "warning");
    } else if (contrasenia.trim() === "") {
      show_alerta("Escribe la contrasenia", "warning");
    } else {
      if (op === 1) {
        if (organizers.some((organizer) => ci === organizer.ci)) {
          //Some devuelve true o false
          show_alerta("La cédula del organizador ya existe", "warning");
        } else if (
          organizers.some((organizer) => correo === organizer.correo)
        ) {
          show_alerta("El correo del organizador ya existe", "warning");
        } else if (ci.length > 10 || ci.length < 10) {
          show_alerta("La cédula debe tener 10 dígitos", "warning");
          return;
        } else if (
          organizers.some((organizer) => correo === organizer.correo)
        ) {
          show_alerta("El correo del organizador ya existe", "warning");
          return;
        } else if (!regexCorreo.test(correo)) {
          show_alerta(
            "El formato del correo electrónico no es válido",
            "warning"
          );
          return;
        }

        parametros = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          ci: ci.trim(),
          correo: correo.trim(),
          contrasenia: contrasenia.trim(),
          id_admin: adminObj.id_admin,
        };
        //metodo = "POST";
        axios
          .post(url, parametros)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            show_alerta(
              "El organizador ha sido agregado exitosamente",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error al realizar la solicitud POST:", error);
          });
      } else {
        parametros = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          ci: ci.trim(),
          correo: correo.trim(),
          contrasenia: contrasenia.trim(),
          id_admin,
        };
        //metodo = "PUT";

        axios
          .put(urlEditar, parametros)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            show_alerta(
              "El organizador ha sido actualizado exitosamente",
              "success"
            );
            setShowModal(false);
          })
          .catch((error) => {
            console.error("Error al realizar la solicitud PUT:", error);
          });
      }
      //enviarSolicitud(metodo, parametros);
    }
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
      <Container>
        <button
          className="btn btn-primary"
          onClick={() => setShowModalInsert(true)}
        >
          Insertar nuevo organizador
        </button>
        <Button className="btn btn-success" onClick={handleRecuperar}>
          Recuperar Organizador
        </Button>
        <br></br>
        <Table className="table">
          <thead>
            <tr>
              <th>Id_organizador</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>CI</th>
              <th>Correo</th>
              <th>Id_admin</th>
            </tr>
          </thead>
          <tbody>
            {organizers
              .filter((organizer) => !organizer.eliminado)
              .filter((organizer) => organizer.id_admin === adminObj.id_admin)
              .map((organizer) => (
                <tr key={organizer.id_organizador}>
                  <td>{organizer.id_organizador}</td>
                  <td>{organizer.nombre}</td>
                  <td>{organizer.apellido}</td>
                  <td>{organizer.ci}</td>
                  <td>{organizer.correo}</td>
                  <td>{organizer.id_admin}</td>
                  <td>
                    <Button
                      onClick={() =>
                        handleEditarUsuario(organizer.id_organizador)
                      }
                      className="btn btn-warning"
                    >
                      Editar
                    </Button>{" "}
                    <Button
                      className="btn btn-danger"
                      onClick={() =>
                        handleEliminarUsuario(organizer.id_organizador)
                      }
                    >
                      Dar de baja
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>

      <Modal isOpen={showModal}>
        <ModalHeader>
          <div>
            <h3>Editar Organizador</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Apellido:</label>
            <input
              className="form-control"
              name="apellido"
              type="text"
              onChange={(e) => setApellido(e.target.value)}
              value={apellido}
            />
          </FormGroup>

          <FormGroup>
            <label>CI:</label>
            <input
              className="form-control"
              name="ci"
              type="text"
              onChange={(e) => setCi(e.target.value)}
              value={ci}
            />
          </FormGroup>

          <FormGroup>
            <label>Correo:</label>
            <input
              className="form-control"
              name="correo"
              type="text"
              onChange={(e) => setCorreo(e.target.value)}
              value={correo}
            />
          </FormGroup>

          <FormGroup>
            <label>Contraseña:</label>
            <input
              className="form-control"
              name="contrasenia"
              type="text"
              onChange={(e) => setContrasenia(e.target.value)}
              value={contrasenia}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validar(2)}>
            Editar
          </Button>
          <Button color="danger" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/*------------------------------------- */}

      <Modal isOpen={showModalInsert}>
        <ModalHeader>
          <div>
            <h3>Insertar Organizador</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre"
              type="text"
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Apellido:</label>
            <input
              className="form-control"
              name="apellido"
              type="text"
              onChange={(e) => setApellido(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>CI:</label>
            <input
              className="form-control"
              name="ci"
              type="text"
              onChange={(e) => setCi(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Correo:</label>
            <input
              className="form-control"
              name="correo"
              type="text"
              onChange={(e) => setCorreo(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Contraseña:</label>
            <input
              className="form-control"
              name="contrasenia"
              type="text"
              onChange={(e) => setContrasenia(e.target.value)}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validar(1)}>
            Insertar
          </Button>
          <Button color="danger" onClick={() => setShowModalInsert(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/*------------------------------------- */}

      <Modal isOpen={showModalRecuperar} size="lg">
        <ModalHeader>
          <div>
            <h3>Recuperar Organizador</h3>
            <Button
              type="button"
              className="close" // Agregar la clase "float-right" para alinear a la derecha
              aria-label="close"
              style={botonDerechaStyles}
              onClick={() => setShowModalRecuperar(false)}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </div>
        </ModalHeader>

        <Container>
          <Table>
            <thead>
              <tr>
                <th>ID organizador</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>CI</th>
                <th>Correo</th>
              </tr>
            </thead>

            <tbody>
              {organizers
                .filter((organizer) => organizer.eliminado === true)
                .filter(
                  (organizer) =>
                    organizer.id_organizador === adminObj.id_organizador
                )
                .map((organizer) => (
                  <tr key={organizer.id_organizador}>
                    <td>{organizer.id_organizador}</td>
                    <td>{organizer.nombre}</td>
                    <td>{organizer.apellido}</td>
                    <td>{organizer.ci}</td>
                    <td>{organizer.correo}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          recuperar_organizador(organizer.id_organizador)
                        }
                      >
                        Recuperar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Container>
      </Modal>
    </>
  );
};

export default ShowOrganizers;
