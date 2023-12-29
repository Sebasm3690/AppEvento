// Dashboard.js
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/userv/', {
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
        throw new Error('Error al obtener datos del administrador');
      }
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/loginadm/';
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.status === 200) {
        localStorage.removeItem('jwt');
        window.location.href = '/loginadm/';
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {adminData ? (
        <div>
          <p>ID del Administrador: {adminData.id_admin}</p>
          <p>Nombre: {adminData.nombre}</p>
          <p>Nombre: {adminData.apellido}</p>
          <p>CI: {adminData.ci}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <p>Cargando datos del administrador...</p>
      )}
    </div>
  );
};

export default Dashboard;