import React from 'react';
import NavBar from '../navbar';
import Footer from '../footer';
import "./../styles/quienes-somos.css";

function QuienesSomos() {
  return (
    <div>
      <NavBar />
      <div className="quienes-somos-container">
        <h1 >QUIÉNES SOMOS</h1>
        <p className="quienes-somos-content">
          Somos una plataforma dedicada a conectar personas a través de eventos
          increíbles. Nuestra misión es facilitar la organización y participación
          en eventos, creando experiencias inolvidables para todos.
        </p>

        <div className="quienes-somos-desarrolladores">
          <h3 className="quienes-somos-subtitle">Triggers</h3>
          <ul className="desarrolladores-list">
            <li>Franklin Alvarez - 6854</li>
            <li>David Cabezas - 6862</li>
            <li>Styven Padilla - 6889</li>
            <li>Sebastián Merino - 6882</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default QuienesSomos;
