import React, { useEffect, useState } from 'react';

const Organizador = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/organizador/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        const data = await response.json();
        setAdminData(data);
      } else {
        throw new Error('Error al obtener datos del Organizador');
      }
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/loginorg/';
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logoutOrg/', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.status === 200) {
        localStorage.removeItem('jwt');
        window.location.href = '/loginorg/';
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Panel Organizadores
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
          {adminData ? (
          <div>
            <p>Nombre: {adminData.nombre}</p>
            <p>Apellido: {adminData.apellido}</p>
            <p>CI: {adminData.ci}</p>
          </div>
        ) : (
          <p>Cargando datos del organizador...</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default Organizador;