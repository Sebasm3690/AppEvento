import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "./navbar";
import Footer from "./footer";
import "./styles/form.css";

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
      } else if (data.error === 'Correo no confirmado') {
        // Muestra una alerta si el correo no está confirmado
        alert('Su correo no se ha confirmado, verifiquelo de nuevo');
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
          <center>
            <h1>¡BIENVENIDO!</h1> <br></br>
          </center>
          <form className="custom-form">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            {error && <p className="text-danger">{error}</p>}
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleLogin}
            >
              INICIAR SESIÓN
            </button>
            <p className="form-info">
              ¿Aún no tienes cuenta?{' '}
              <button
                type="button"
                className="btn btn-link btn-register"
                onClick={() => navigate('/registroAsistente')}
              >
                Regístrate aquí
              </button>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
