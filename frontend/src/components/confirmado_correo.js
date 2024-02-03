import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import NavBar from "./navbar";
import Footer from "./footer";
import "./styles/inicio.css";
import "./styles/fiesta.css";

const ConfirmationPage = () => {
  return (
    <>
      <NavBar />
      <div style={{ marginTop: '-100px', height: 'calc(100vh - 110px)', display: 'grid', placeItems: 'center' }}>
        <CardBody className="text-center confirmation-card">
          <h1 className="confirmation-title">CORREO CONFIRMADO EXITOSAMENTE</h1>
          <p className="confirmation-message">¡Tu correo ha sido confirmado correctamente!</p>
          <p className="confirmation-action">
            Ir a{" "}
            <Link to="/loginAs/" className="btn btn-primary custom-button">
              INICIAR SESIÓN
            </Link>
          </p>
        </CardBody>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmationPage;
