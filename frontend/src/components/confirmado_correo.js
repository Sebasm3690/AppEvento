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
      <div style={{ marginTop: '-20px', height: 'calc(100vh - 110px)', display: 'grid', placeItems: 'center' }}>
        <Card className="d-flex justify-content-center mx-auto fiesta-animation" style={{ backgroundColor: '#f2f2f2' }}>
          <CardBody className="text-center">
            <h1>Correo confirmado exitosamente</h1>
            <p>¡Tu correo ha sido confirmado correctamente!</p>
            <p>
              Ir a{" "}
              <Link to="/loginAs/" className="btn btn-primary">
                Iniciar Sesión
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmationPage;
