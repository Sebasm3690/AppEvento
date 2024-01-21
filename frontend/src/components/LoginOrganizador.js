// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "./navbar";
import Footer from "./footer";

const LoginOrganizador = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="col-md-6 offset-md-3">
          <center>
            <h1>ORGANIZADOR</h1> <br></br>
          </center>
          <form className="custom-form">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Correo electrónico"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={loginUser}
            >
              INICIAR SESIÓN
            </button>
            <p className="form-info">
                ¿Eres Administrador?{' '}
              <button
                type="button"
                className="btn btn-link btn-reset"
                onClick={() => navigate('/loginadm')}
              >
                Ingresa Aquí
              </button>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginOrganizador;