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
      <h2>Organizadores</h2>
      {adminData ? (
        <div>
          <p>Nombre: {adminData.nombre}</p>
          <p>Apellido: {adminData.apellido}</p>
          <p>CI: {adminData.ci}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <p>Cargando datos del organizador...</p>
      )}
    </div>
  );
};

export default Organizador;