import React from 'react';
import { Link } from "react-router-dom";
import Logo from '../otros/logo'
import '../styles/footerHP.css'; 

function FooterHP() {
  return (
    <footer className="footerHP">
      <div className="containerfHP">
        <p>&copy; 2024 PartyConnect. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default FooterHP;
