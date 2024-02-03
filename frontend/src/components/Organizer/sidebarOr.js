// src/components/Sidebar/Sidebar.js
import React from 'react';
import './sidebarOr.css';

const Sidebar = ({ setShowModalInsert, setShowModalImpuestosIngresar, setShowModalRecuperar, navigate, id_organizador, handleOpen }) => {

  return (
    <div className="sidebar">
      <button className="btn" onClick={() => setShowModalInsert(true)}>
        NUEVO EVENTO
      </button>
      {/* Agregar condicional aquí para AGREGAR IMPUESTOS si es necesario */}
      <button className="btn" onClick={() => setShowModalRecuperar(true)}>
        HISTÓRICO
      </button>
      <button className="btn" onClick={() => navigate(`/dashboardGeneral/${id_organizador}`)}>
        DASHBOARD GENERAL
      </button>
      <button className="btn" onClick={handleOpen}>
        ESCÁNER QR
      </button>
      {/* QRScanner Component */}
    </div>
  );
};

export default Sidebar;
