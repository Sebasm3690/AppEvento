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
import '../styles/showor.css'
//import Sidebar from './sidebar';
//import "./indexAdmin.css";

export default function ShowOrganizers({ adminObj }) {
  return (
    <div>
      <CrudOrganizers adminObj={adminObj} />;
    </div>
  );
}

function Header() {
  return <h1>🌍Far away🌅</h1>;
}

const CrudOrganizers = ({ adminObj }) => {
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

  const validarCedulaEcuatoriana = (cedula) => {
    if (cedula.length !== 10) {
      return false;
    }
    const digitos = cedula.substring(0, 9).split("").map(Number);
    const digitoVerificador = parseInt(cedula.charAt(9), 10);
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let multiplicador = i % 2 === 0 ? 2 : 1;
      let resultado = digitos[i] * multiplicador;
      suma += resultado > 9 ? resultado - 9 : resultado;
    }
    let modulo = suma % 10;
    let resultadoEsperado = modulo === 0 ? 0 : 10 - modulo;
    return resultadoEsperado === digitoVerificador;
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

  // Función para verificar si un organizador ha creado eventos
  const hasOrganizerCreatedEvents = async (organizerId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/api/v1/event/`);
      const events = response.data;
      const organizerEvents = events.filter(event => event.id_organizador === organizerId);
      return organizerEvents.length > 0;
    } catch (error) {
      console.error("Error al verificar eventos del organizador:", error);
      return false; 
    }
  };

  const handleEliminarUsuario = async (userId) => {
    const hasEvents = await hasOrganizerCreatedEvents(userId);
    if (hasEvents) {
      show_alerta("El organizador no puede ser dado de baja porque ha creado eventos.", "error");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/borrado_logico_organizador/${userId}/`
      );
      show_alerta("El organizador ha sido dado de baja", "success");
      setOrganizers((prevOrganizadores) =>
        prevOrganizadores.filter((o) => o.id_organizador !== userId)
      );
    } catch (error) {
      console.error("Error al intentar borrar al organizador:", error);
      show_alerta("No se pudo eliminar al organizador, intenta de nuevo más tarde.", "error");
    }
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
    } else if (!validarCedulaEcuatoriana(ci.trim())) {
      show_alerta("La cedula del organizador no es valida", "warning");
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
        } /*else if (
          organizers
            .filter((organizer) => organizer.eliminado === false)
            .some((organizer) => organizer.nombre === nombre)
        ) {
          show_alerta(
            "Ya existe un organizador con el nombre del organizador ingresado",
            "warning"
          );
          return;
        }*/ else if (
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
            setOrganizers((organizers) => [...organizers, response.data]);
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.error
            ) {
              show_alerta(error.response.data.error, "error");
            } else {
              console.error("Error al realizar la solicitud POST:", error);
              show_alerta("Error al agregar el organizador", "error");
            }
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
        <div style={{ paddingBlockEnd: '50px'}}>
            <button
              style={{ backgroundColor: '#2980b9', borderColor: '#2980b9', padding: '10px 20px', borderRadius: '8px' }}
              className="btn btn-primary"
              onClick={() => setShowModalInsert(true)}
            >
              INSERTAR ORGANIZADOR
            </button> 
            <span style={{ margin: '0 40px' }}></span>
            <Button style={{ backgroundColor: '#6aabb5', borderColor: '#6aabb5', color: '#fff', padding: '10px 20px', borderRadius: '8px' }} className="btn btn-primary" onClick={handleRecuperar}>
              RECUPERAR ORGANIZADOR
            </Button>
        </div>

            <Table className="table-custom table-borderless table-responsive">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cédula de Identidad</th>
                  <th>Correo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {organizers
                  .filter((organizer) => !organizer.eliminado)
                  .filter((organizer) => organizer.id_admin === adminObj.id_admin)
                  .map((organizer) => (
                    <tr key={organizer.id_organizador}>
                      <td data-title="ID Organizador">{organizer.id_organizador}</td>
                      <td data-title="Nombre">{organizer.nombre}</td>
                      <td data-title="Apellido">{organizer.apellido}</td>
                      <td data-title="Cédula de Identidad">{organizer.ci}</td>
                      <td data-title="Correo">{organizer.correo}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        
                          <Button
                            style={{
                              color: "#fff",
                              padding: "7px 14px",
                              borderRadius: "8px",
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#ffc107' // Color para el botón warning
                            }}
                            onClick={() =>
                              handleEditarUsuario(organizer.id_organizador)
                            }
                            className="btn btn-warning"
                          >
                            <img src={"https://cdn-icons-png.flaticon.com/512/8188/8188360.png"} alt="Editar" width={'25px'} />
                            <span style={{ margin: '0 3px'}}></span>
                          </Button>
                          <Button
                            style={{
                              color: "#fff",
                              padding: "7px 14px",
                              borderRadius: "8px",
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#dc3545' 
                            }}
                            className="btn btn-danger"
                            onClick={() =>
                              handleEliminarUsuario(organizer.id_organizador)
                            }
                          >
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/2340/2340337.png"
                              alt="Editar"
                              width={"25px"}
                            />
                            <span style={{ margin: "0 3px" }}></span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
      </Container>

      <Modal isOpen={showModal}>
        <ModalHeader>
          <div>
            <h3>EDITAR ORGANIZADOR</h3>
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
            <label>Cédula de Identidad:</label>
            <input
              className="form-control"
              name="ci"
              type="text"
              onChange={(e) => setCi(e.target.value)}
              value={ci}
            />
          </FormGroup>

          <FormGroup>
            <label>Correo Electrónico:</label>
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
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <Button 
                  style={{ backgroundColor: '#3498db', borderColor: '#3498db', color: '#fff', padding: '10px 20px', borderRadius: '8px' }}
                  color="primary" onClick={() => validar(2)}>
                  EDITAR
                </Button>
              </div>
              <div className="col-md-6">
                <Button 
                  style={{ backgroundColor: '#D32F2F', borderColor: '#D32F2F', color: '#fff', padding: '10px 20px', borderRadius: '8px' }}
                  color="primary" onClick={() => setShowModal(false)}>
                  CANCELAR
                </Button>
              </div>
            </div>
          </div>
        </ModalFooter>

      </Modal>

      {/*------------------------------------- */}

      <Modal isOpen={showModalInsert}>
        <ModalHeader>
          <div>
            <h3>REGISTRO</h3>
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
            <label>Cédula de Identidad:</label>
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
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <Button 
                  style={{ backgroundColor: '#3498db', borderColor: '#3498db', color: '#fff', padding: '10px 20px', borderRadius: '8px' }}
                  color="primary" onClick={() => validar(1)}>
                  REGISTRAR
                </Button>
              </div>
              <div className="col-md-6">
                <Button 
                  style={{ backgroundColor: '#D32F2F', borderColor: '#D32F2F', color: '#fff', padding: '10px 20px', borderRadius: '8px' }}
                  color="primary" onClick={() => setShowModalInsert(false)}>
                  CANCELAR
                </Button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      {/*------------------------------------- */}

      <Modal isOpen={showModalRecuperar} size="lg">
        <ModalHeader>
          <div>
            <Button
              type="button"
              className="close" 
              aria-label="close"
              style={botonDerechaStyles}
              onClick={() => setShowModalRecuperar(false)}
              >
              <span aria-hidden="true">&times;</span>
            </Button>
            <h3>RECUPERAR ORGANIZADORES</h3>
          </div>
        </ModalHeader>

        <Container>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cédula de Identidad</th>
                <th>Correo</th>
              </tr>
            </thead>

            <tbody>
              {organizers
                .filter((organizer) => organizer.eliminado === true)
                .filter((organizer) => organizer.id_admin === adminObj.id_admin)
                .map((organizer) => (
                  <tr key={organizer.id_organizador}>
                    <td>{organizer.id_organizador}</td>
                    <td>{organizer.nombre}</td>
                    <td>{organizer.apellido}</td>
                    <td>{organizer.ci}</td>
                    <td>{organizer.correo}</td>
                    <td>
                      <button
                        style={{ backgroundColor: '#4CAF50 ', borderColor: '#4CAF50', color: '#fff', padding: '10px 20px', borderRadius: '8px' }}
                        onClick={() =>
                          recuperar_organizador(organizer.id_organizador)
                        }
                      >
                        RECUPERAR
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
