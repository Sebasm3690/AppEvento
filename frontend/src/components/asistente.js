import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Asistente() {
  const [asistenteData, setAsistenteData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Llama a la API de logout
      await axios.post('http://localhost:8000/api/logoutAs');
      // Redirige a la página de inicio de sesión después de cerrar sesión
      navigate('/loginas');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/asistente');
        console.log('Response from API:', response.data);
        setAsistenteData(response.data);
      } catch (error) {
        console.error('Error fetching asistente data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <h2>Página del Asistente</h2>
      {asistenteData && (
        <>
          <p>Bienvenido, {asistenteData.nombre} {asistenteData.apellido}.</p>
          {/* Mostrar más información del asistente según tus necesidades */}
        </>
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Asistente;