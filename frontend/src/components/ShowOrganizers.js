import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowOrganizers = () => {
  const url = "http://127.0.0.1:8000/api/v1/organizador/";
  const [organizers, setOrganizers] = useState([]);
  const [id_organizador, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [ci, setCi] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [id_admin, setId_admin] = useState("");

  useEffect(() => {
    getOrganizers();
  }, []);

  const getOrganizers = async () => {
    const respuesta = await axios.get(url);
    setOrganizers(respuesta.data);
  };

  const handleDelete = async (id) => {
    // Lógica para eliminar el organizador con el ID proporcionado
    await axios.delete(`${url}${id}/`);
    // Actualizar la lista de organizadores después de la eliminación
    getOrganizers();
  };

  const handleUpdate = (organizer) => {
    // Lógica para actualizar el estado con los datos del organizador seleccionado
    setId(organizer.id_organizador);
    setNombre(organizer.nombre);
    setApellido(organizer.apellido);
    setCi(organizer.ci);
    setCorreo(organizer.correo);
    setContrasenia(organizer.contrasenia);
    setId_admin(organizer.id_admin);
  };

  return (
    <div>
      <h1>Lista de Organizadores</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>CI</th>
            <th>Correo</th>
            <th>Contraseña</th>
            <th>ID Admin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((organizer) => (
            <tr key={organizer.id_organizador}>
              <td>{organizer.id_organizador}</td>
              <td>{organizer.nombre}</td>
              <td>{organizer.apellido}</td>
              <td>{organizer.ci}</td>
              <td>{organizer.correo}</td>
              <td>{organizer.contrasenia}</td>
              <td>{organizer.id_admin}</td>

              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(organizer.id_organizador)}
                >
                  Eliminar
                </button>{" "}
                <button
                  className="btn btn-warning"
                  onClick={() => handleUpdate(organizer)}
                >
                  Actualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowOrganizers;
