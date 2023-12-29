// Login.js
import React, { useState } from 'react';

const LoginAdm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
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
        window.location.href = '/dashboardadm/'; // Ajusta según tu estructura de rutas
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <input
        type="text"
        placeholder="Correo electrónico"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={loginUser}>Iniciar sesión</button>
    </div>
  );
};

export default LoginAdm;
