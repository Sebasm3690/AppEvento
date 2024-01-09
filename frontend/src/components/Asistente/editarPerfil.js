import React, { useState, useEffect } from 'react';

const EditarPerfil = () => {
  const [asistenteData, setAsistenteData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: ''
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
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        const data = await response.json();
        setAsistenteData(data);
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
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
      const response = await fetch('http://127.0.0.1:8000/api/api/v1/Asistente/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        setIsEditing(false);
        fetchData();
        alert('Datos de Asistente actualizados exitosamente');
      } else {
        throw new Error('Error al actualizar datos del asistente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar datos de Asistente');
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
        {/* ... (mismo código) */}
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
