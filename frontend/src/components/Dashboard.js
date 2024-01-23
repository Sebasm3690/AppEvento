import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './otros/cardsh';
import Sidebar from './otros/sidebardsh';

const DashboardOrg = () => {
  const [totalGenerado, setTotalGenerado] = useState(0);
  const [totalCantidadGenerada, setTotalCantidadGenerada] = useState(0);
  const [totalSobrante, setTotalSobrante] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Primera API: Total Generado
        const responseGenerado = await axios.get('http://localhost:8000/api/monto_organizador/', {
          withCredentials: true,
        });
        setTotalGenerado(responseGenerado.data.total_generado);

        // Segunda API: Total Cantidad Generada
        const responseCantidadGenerada = await axios.get('http://localhost:8000/api/cantidadorg/', {
          withCredentials: true,
        });
        setTotalCantidadGenerada(responseCantidadGenerada.data.total_cantidad_generada);

        // Tercera API: Total Sobrante
        const responseSobrante = await axios.get('http://localhost:8000/api/cantidadsoborg/', {
          withCredentials: true,
        });
        setTotalSobrante(responseSobrante.data.total_sobrante);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2">Dashboard</h1>
          <button className="btn btn-primary">Generate Report</button>
        </div>
        <div className="row">
          <Card title="Total Generado" value={`$${totalGenerado}`} />
          <Card title="Cantidad vendida de boletos" value={`${totalCantidadGenerada} unidades`} />
          <Card title="Cantidad de boletos a vender" value={`${totalSobrante} unidades`} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOrg;