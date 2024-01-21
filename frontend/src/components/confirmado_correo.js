import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ConfirmationPage = () => {
  const [confirmationMessage, setConfirmationMessage] = useState('Confirmando correo...');

  const { token } = useParams();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/confirmar/${token}/`);

        if (response.ok) {
          const data = await response.json();
          setConfirmationMessage(data.message || 'Correo confirmado exitosamente.');
        } else {
          console.error('Error al confirmar el correo:', response.statusText);
          setConfirmationMessage('Error al confirmar el correo.');
        }
      } catch (error) {
        console.error('Error al confirmar el correo:', error.message);
        setConfirmationMessage('Error al confirmar el correo.');
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div>
      <h1>Confirmación de Correo Electrónico</h1>
      <p>{confirmationMessage}</p>
    </div>
  );
};

export default ConfirmationPage;