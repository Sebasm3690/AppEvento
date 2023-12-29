import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Organizador() {
  const [OrganizadorData, setOrganizadorData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Llama a la API de logout
      await axios.post('http://localhost:8000/api/logoutOrg');
      // Redirige a la página de inicio de sesión después de cerrar sesión
      navigate('/loginorganizador');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/organizador');
        console.log('Response from API:', response.data);
        setOrganizadorData(response.data);
      } catch (error) {
        console.error('Error fetching organizador data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <h2>Página del Organizador</h2>
      {OrganizadorData && (
        <>
          <p>Bienvenido, {OrganizadorData.nombre} {OrganizadorData.apellido}.</p>
          {/* Mostrar más información del asistente según tus necesidades */}
        </>
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Organizador;