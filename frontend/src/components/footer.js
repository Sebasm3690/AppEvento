import React from 'react';
import { Link } from "react-router-dom";
import Logo from './otros/logo'
import './styles/footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="containerf">
        <p>&copy; 2024 PartyConnect. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;