import React, { useState, useEffect } from 'react';

const Asistente = () => {
  const [asistenteData, setAsistenteData] = useState(null);

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

  return (
    <div>
      <h2>Página del Asistente</h2>
      {asistenteData && (
        <>
          <p>Bienvenido, {asistenteData.nombre} {asistenteData.apellido}.</p>
        </>
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Asistente;