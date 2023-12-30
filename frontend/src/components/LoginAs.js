import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "./navbar";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/loginAs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem('jwt', data.jwt);
        window.location.href = '/asistente'; 
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al iniciar sesión');
    }
  };  

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="col-md-6 offset-md-3">
          <h1>Asistente</h1> <br></br>
          <h2>Iniciar Sesión</h2>
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={handleLogin}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => navigate('/registroAsistente')}
            >
              Registrarse
            </button>
          </form>
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;