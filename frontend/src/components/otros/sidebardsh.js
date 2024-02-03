// src/components/Sidebar.js
import React from 'react';

function Sidebar() {
  return (
    <div className="d-flex flex-column bg-primary text-white p-3" style={{ width: '250px' }}>
      <div className="mb-4">
        <h2 className="text-white h3 mb-3">👤 Bienvenido</h2>
        <div className="text-uppercase small">Que desea hacer?</div>
        <ul className="nav flex-column small">
          <li className="nav-item">
            <a href="#" className="nav-link text-white">Regresar</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">Generar reportes</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
