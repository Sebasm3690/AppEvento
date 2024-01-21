import React from 'react';
import { Link } from "react-router-dom";
import Logo from './otros/logo'
import './styles/footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2023 PartyConnect. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
