import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
            {userData ? (
                <div>
                    <h1>Bienvenido, {userData.nombre}</h1>
                    <h2>Historial de compras:</h2>
                    <ul>
                        {historial.map(orden => (
                            <li key={orden.id}>
                                {/* Aquí puedes mostrar los detalles de cada orden si es necesario */}
                                Fecha: {orden.fecha} - Total: {orden.valor_total} - Numero de orden: {orden.num_orden} <Link to={`/observarqr/?num_orden=${orden.num_orden}`}>Ver Boleto</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
}

export default ComprasAsistente;
