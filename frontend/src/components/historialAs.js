import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Table } from 'reactstrap';
import NavBarAsis from "./Asistente/navbaras";
import Footer from "./footer";

function ComprasAsistente() {
    const [historial, setHistorial] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Obtener datos del usuario
        axios.get('http://localhost:8000/api/asistente', { withCredentials: true })
            .then(response => {
                setUserData(response.data);
                
                // Luego, obtener historial basado en el id_asistente del usuario
                return axios.get(`http://localhost:8000/historial-compras/${response.data.id_asistente}/`, { withCredentials: true });
            })
            .then(response => {
                setHistorial(response.data);
            })
            .catch(error => {
                console.error("Error al obtener datos:", error);
            });
    }, []); // La lista vacía significa que esto se ejecutará una vez al montar el componente

    return (
        <div>
            <NavBarAsis />
            <br></br>
            <h1 className="display-4 text-center mb-4">HISTORIAL DE COMPRAS</h1><br></br>
            {userData ? (
                <Table hover style={{ fontSize: '20px', fontFamily: 'Cambria, sans-serif' }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Número de Orden</th>
                    <th>Boletos QR</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((orden, index) => (
                    <tr key={orden.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{orden.fecha}</td>
                      <td>{orden.valor_total}</td>
                      <td>{orden.num_orden}</td>
                      <td>
                        <Button color="success">
                          <Link
                            to={`/observarqr/?num_orden=${orden.num_orden}`}
                            className="link-negro"
                            style={{ fontSize: '18px', fontFamily: 'Cambria, sans-serif' }}
                          >
                            Ver Boleto QR
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>              
            ) : (
                <p>Cargando datos...</p>
            )}
            <Footer />
        </div>
    );
}

export default ComprasAsistente;
