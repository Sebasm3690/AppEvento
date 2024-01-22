import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ConfirmationPage = () => {

  return (
    <div>
    <h1>Correo confirmado exitosamente</h1>
    <p>¡Tu correo ha sido confirmado correctamente!</p>
    <p>Ir a <Link to="/loginAs/">iniciar sesión</Link></p>
  </div>
  );
};

export default ConfirmationPage;