import React, { useState, useEffect } from 'react';
import { show_alerta } from "../../functions";
import NavBarAsis from "../Asistente/navbaras";
import Footer from "../footer";

const EditarPerfil = () => {
  const [asistenteData, setAsistenteData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    ci: '',
  });
  const [tempFormData, setTempFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    ci: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(true); // Inicia en modo edición directa

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
        setAsistenteData(data);
        setFormData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          ci: data.ci || '',
          password: data.password || '',
        });
        setTempFormData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          ci: data.ci || '',
          password: data.password || '',
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

  const handleSaveEdit = async () => {
    try {
      if (!formData.password) {
        show_alerta("Ingrese la Contraseña para Actualizar", "warning");
        return;
      }

      await fetchData();
      if (!asistenteData) {
        console.error('No se han cargado los datos del asistente. Imposible guardar cambios.');
        return;
      }

      const idToUse = asistenteData.id_asistente || asistenteData.id;

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
        // Redirect to '/asistente' after successful save
        window.location.href = '/asistente';
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
    // Update the main state while editing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Update the temporary state for cancellation
    setTempFormData({
      ...tempFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <NavBarAsis />
      <div className="container mt-5">
        <div className="col-md-6 offset-md-3">
          {asistenteData && (
            <>
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
                <span className="mx-2"></span>
                <button className="btn btn-secondary" onClick={() => { window.location.href = '/asistente'; }}>Cancelar</button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditarPerfil;
