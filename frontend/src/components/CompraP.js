import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompraR = () => {
    const [error, setError] = useState(null);
    const params = new URLSearchParams(window.location.search);
    const description = params.get('description').split("/")[0];
    const value = params.get('value').split("/")[0];
    const id = params.get('id').split("/")[0];
    const currentDate = new Date().toLocaleDateString();
    const navigate = useNavigate();

    const [currentStock, setCurrentStock] = useState(null);

    useEffect(() => {
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

    const generateQRCode = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/api/v1/contieneqr/${id}/`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error al generar el código QR:', error);
            throw error;
        }
    };

    const sendEmailToAsistente = async () => {
        try {
            // Realizar la solicitud GET para obtener los datos del asistente
            const response = await fetch('http://localhost:8000/api/asistente', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include' // Para enviar las cookies si es necesario
            });
    
            if (!response.ok) {
                throw new Error(`Error al obtener los datos del asistente: ${response.statusText}`);
            }
    
            const data = await response.json();
            const asistenteId = data.id_asistente; // Asegúrate de que 'id_asistente' sea el campo correcto en tu modelo Asistente.
    
            // Realizar la solicitud POST para enviar el correo
            const sendEmailResponse = await fetch(`http://127.0.0.1:8000/api/enviar-correo/${asistenteId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Puedes agregar más headers si es necesario
                },
                credentials: 'include' // Para enviar las cookies si es necesario
            });
    
            const responseData = await sendEmailResponse.json();
            console.log(responseData);
    
        } catch (error) {
            console.error('Error al enviar el correo:', error);
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
                alert("Compra realizada correctamente! Se le enviará su entrada al correo electrónico registrado");

                // Llamar a la función para enviar correo
                await sendEmailToAsistente();

                navigate('/asistente/');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al realizar la compra');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Resumen de la compra</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="valorTotal" className="form-label">A continuación se le muestra lo que compró</label>
                    <p>Valor total de la compra: {value} $</p>
                    <p>Cantidad de boletos comprados: {description}</p>
                    <p>Fecha de compra: {currentDate}</p>
                </div>
                <button type="submit" className="btn btn-primary">Confirmar</button>
            </form>
        </div>
    );
};

export default CompraR;


