// Login.js
import React, { useState } from 'react';

const LoginOrganizador = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/loginOrg/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para enviar y recibir cookies desde el servidor
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem('jwt', data.jwt);
        // Redirecciona a otra página después de iniciar sesión
        window.location.href = '/organizador/'; // Ajusta según tu estructura de rutas
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2>Iniciar sesión Organizadores</h2>
        <form>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Correo electrónico"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={loginUser}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginOrganizador;