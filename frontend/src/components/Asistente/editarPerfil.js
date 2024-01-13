import React, { useState, useEffect } from 'react';
import { show_alerta } from "../../functions";

const EditarPerfil = () => {
  const [asistenteData, setAsistenteData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    ci: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/asistente', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Datos del asistente:', data);
        setAsistenteData(data);
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          ci: data.ci,
          password: data.password,
        });
      } else {
        throw new Error('Error al obtener datos del asistente');
      }
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/loginas';
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logoutAs', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.status === 200) {
        localStorage.removeItem('jwt');
        window.location.href = '/loginas';
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      await fetchData();
      if (!asistenteData) {
        console.error('No se han cargado los datos del asistente. Imposible guardar cambios.');
        return;
      }

      const idToUse = asistenteData.id_asistente || asistenteData.id;

      if (!formData.password) {
        show_alerta("Ingrese la Contraseña", "warning");
        return;
      }

      const requestBody = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        ci: formData.ci,
        password: formData.password,
      };

      const response = await fetch(`http://127.0.0.1:8000/api/api/v1/Asistente/${idToUse}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        setIsEditing(false);
        await fetchData();
        show_alerta("Datos de Asistente Actualizados Exitosamente", "success");
      } else {
        const errorResponse = await response.json();
        console.error('Error al actualizar datos del asistente:', errorResponse);
        show_alerta(`Error al actualizar datos de Asistente: ${errorResponse.detail || 'Error desconocido'}`, "warning");
      }
    } catch (error) {
      console.error('Error:', error);
      show_alerta("Error al actualizar datos de Asistente", "warning");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/asistente">
            Inicio
          </a>
          <a className="navbar-brand" href="/editarPerfil">
            Editar Perfil
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="col-md-6 offset-md-3">
          {asistenteData && (
            <>
              {isEditing ? (
                <div>
                  <p className="mb-3">Editando Perfil de {asistenteData.nombre} {asistenteData.apellido}.</p>
                  <form>

                  <div className="mb-3">
                      <label htmlFor="ci" className="form-label">Cédula</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ci"
                        name="ci"
                        value={formData.ci}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="apellido" className="form-label">Apellido</label>
                      <input
                        type="text"
                        className="form-control"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Correo Electrónico</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>

                  </form>
                  <button className="btn btn-primary" onClick={handleSaveEdit}>Guardar</button>
                  <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancelar</button>
                </div>
              ) : (
                <div>
                  <p className="mb-3">Perfil de {asistenteData.nombre} {asistenteData.apellido}.</p>
                  <button className="btn btn-warning" onClick={handleEditClick}>Editar</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarPerfil;
