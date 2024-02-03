import React from 'react';
import '../Admin/sidebar.css'

const Sidebar = ({ onInsertClick, onRecoverClick }) => {
  return (
    <div className="sidebar">
      <button className="sidebar-item" onClick={onInsertClick}>
        INSERTAR ORGANIZADOR
      </button>
      <button className="sidebar-item" onClick={onRecoverClick}>
        RECUPERAR ORGANIZADOR
      </button>
    </div>
  );
};

export default Sidebar;
