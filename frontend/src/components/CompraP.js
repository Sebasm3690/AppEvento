import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'reactstrap'; 
import NavBarAsis from "./Asistente/navbaras";
import Footer from "./footer";
import { show_alerta } from "../functions";
import "./styles/compra.css";

import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    CardFooter,
  } from 'reactstrap';

const CompraR = () => {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const params = new URLSearchParams(window.location.search);
    const description = params.get('description').split("/")[0];
    const value = params.get('value').split("/")[0];
    const id = params.get('id').split("/")[0];
    const currentDate = new Date().toLocaleDateString();
    const navigate = useNavigate();
    const [currentStock, setCurrentStock] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/asistente', { withCredentials: true })
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener datos del asistente:', error);
            });

        const fetchStock = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/verstockv/${id}/`);
                const data = await response.json();
                setCurrentStock(data.stock);
            } catch (error) {
                console.error('Error fetching stock:', error);
            }
        };

        fetchStock();
    }, [id]);

    const enviarCorreo = async (idContiene) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/asistentes/${userData.id_asistente}/contiene/${idContiene}/enviar_correo/`);
            return response.data;
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response1 = await fetch('http://localhost:8000/api/crear-orden/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    valor_total: value,
                }),
            });

            const data1 = await response1.json();
            const updatedStock = currentStock - parseInt(description, 10);

            const response3 = await fetch(`http://127.0.0.1:8000/api/actuv/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    stock_actual: updatedStock,
                }),
            });

            const data3 = await response3.json();

            if (data3.status === 'success') {
                show_alerta("Compra realizada Correctamente! Se le enviará su entrada al correo electrónico registrado", "success");
                
                try {
                    const response2 = await fetch('http://127.0.0.1:8000/compra-boleto/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            id_boleto: id,
                            num_orden: data1.num_orden,
                            cantidad_total: description,
                        }),
                    });

                    const data2 = await response2.json();
                    await enviarCorreo(data2.id_contiene);
                    
                } catch (error) {
                    console.error('Error al enviar el correo:', error);
                }

                navigate('/asistente/');
            }

        } catch (error) {
            setError('Error al realizar la compra');
        }
    };

    return (
        
        <div>
            <NavBarAsis />
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '50px' }}>
            {error && <p className="text-danger">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <Card style={{ width: '25rem' }}>
                    <CardBody>
                        <center >
                            <CardTitle tag="h3" style={{fontWeight: 'bold'}}>RESUMEN DE LA COMPRA</CardTitle>
                        </center>
                    </CardBody>
                    <img alt="Card cap" src="https://fecbiwu.stripocdn.email/content/guids/4d001e18-5396-4c01-ac01-15dfda6a11b8/images/_ba465e2abddd42d88eaaf734fd9b694dremovebgpreview.png" width="100%" />
                    <CardBody>
                        <CardText>
                        <div className="mb-3">
                            <p className="mb-3 valor-total">
                                <strong>Valor total de la compra:</strong> ${value}
                            </p>
                            <p className="mb-3 cantidad-boletos">
                                <strong>Cantidad de boletos comprados:</strong> {description}
                            </p>
                            <p className="mb-3 fecha-compra">
                                <strong>Fecha de compra:</strong> {currentDate}
                            </p>
                        </div>
                        </CardText>
                    </CardBody>
                    <CardFooter className="text-center">
                        <Button type="submit" color="primary"
                            style={{ backgroundColor: '#3498db', borderColor: '#3498db', color: '#fff', padding: '10px 20px', borderRadius: '8px' }}
                        >
                            CONFIRMAR
                        </Button>
                    </CardFooter>
                    </Card>
                </form>
            </div>
            <Footer />  
        </div>
    );
};

export default CompraR;