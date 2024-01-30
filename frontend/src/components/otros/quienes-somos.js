import React from 'react';
import NavBar from '../navbar';
import FooterHP from '../otros/footerHP';
import './../styles/quienes-somos.css';

function QuienesSomos() {
  return (
    <div>
      <NavBar />
      <div className="quienes-somos-container">
        <div className="quienes-somos-card">
          <h1 className="quienes-somos-title">QUIÉNES SOMOS</h1>
          <p className="quienes-somos-content">
            Bienvenido a PartyConnect, la plataforma que transforma la manera en que experimentas eventos. Nos dedicamos a conectar personas a través de experiencias increíbles, facilitando la organización y participación en eventos que generan recuerdos inolvidables.
          </p>
        </div>
        
          <div className="quienes-somos-desarrolladores ">
            <h2 className="quienes-somos-subtitle">Triggers</h2>
            <br></br>
            <ul className="desarrolladores-list">
              <li>👤 Franklin Alvarez - 6854</li>
              <li>👤 David Cabezas - 6862</li>
              <li>👤 Sebastián Merino - 6882</li>
              <li>👤 Styven Padilla - 6889</li>
            </ul>
          </div>

          <div className="contactanos ">
            <br></br>
            <h2 className="quienes-somos-subtitle">Contáctanos</h2>
            <br></br>
            <a href="mailto:francisco.alvarez@espoch.edu.ec">
              <img src="https://img.shields.io/badge/Correo%20Electrónico-francisco.alvarez%40espoch.edu.ec-blue?style=for-the-badge&logo=email&logoColor=white&labelColor=101010" alt="Correo Electrónico"/>
            </a>
            <br></br>
            <br></br>
            <a href="mailto:david.cabezas@espoch.edu.ec">
              <img src="https://img.shields.io/badge/Correo%20Electrónico-david.cabezas%40espoch.edu.ec-red?style=for-the-badge&logo=email&logoColor=white&labelColor=101010" alt="Correo Electrónico"/>
            </a>
            <br></br>
            <br></br>
            <a href="mailto:sebastian.merino@espoch.edu.ec">
              <img src="https://img.shields.io/badge/Correo%20Electrónico-sebastian.merino%40espoch.edu.ec-green?style=for-the-badge&logo=email&logoColor=white&labelColor=101010" alt="Correo Electrónico"/>
            </a>
            <br></br>
            <br></br>
            <a href="mailto:styven.padilla@espoch.edu.ec">
              <img src="https://img.shields.io/badge/Correo%20Electrónico-styven.padilla%40espoch.edu.ec-pink?style=for-the-badge&logo=email&logoColor=white&labelColor=101010" alt="Correo Electrónico" />
            </a>
          </div>
      </div>

      <FooterHP />
    </div>
  );
}

export default QuienesSomos;
