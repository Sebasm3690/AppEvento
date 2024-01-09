// GenerarQR.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GenerarQR({ match }) {
    const [qrImageUrl, setQRImageUrl] = useState(null);
    const params = new URLSearchParams(window.location.search);
    const contieneId = params.get('num_orden').split("/")[0];

    useEffect(() => {
        // URL de tu API donde se genera el código QR
        const apiUrl = `http://127.0.0.1:8000/api/api/v1/contieneqr/${contieneId}/`; // Reemplaza con tu URL correcta
    
        // Realizar una solicitud GET para obtener el código QR
        axios.get(apiUrl, { responseType: 'blob' })
          .then(response => {
            // Crear una URL para la imagen blob
            const imageUrl = URL.createObjectURL(response.data);
            setQRImageUrl(imageUrl);
          })
          .catch(error => {
            console.error('Error al obtener el código QR:', error);
          });
    
        // Limpiar la URL del objeto blob al desmontar el componente
        return () => {
          if (qrImageUrl) {
            URL.revokeObjectURL(qrImageUrl);
          }
        };
      }, [contieneId]);

    return (
        <div>
            <h1>
            Aqui tiene su boleto:
            <br/>
            {qrImageUrl && <img src={qrImageUrl} alt="Código QR" />}
            </h1>
        </div>
    );
}

export default GenerarQR;