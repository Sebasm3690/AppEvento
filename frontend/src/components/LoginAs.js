import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "./navbar";
import Footer from "./footer";
import "./styles/form.css";
import { FaUser, FaEnvelope, FaLock, FaIdCard } from 'react-icons/fa';

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
      <div className="container mt-5"
        style={{
          paddingTop: '50px'
        }}
      >
        <div className="col-md-6 offset-md-3">
          <div style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1589810264340-0ce27bfbf751?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZlcnRpY2FsJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww)',
            backgroundSize: 'cover',  // Ajusta el tamaño de la imagen
            width: '100%',  // Ancho del div
            height: '600px',  // Altura del div
            borderRadius: '30px',
          }}>
            <center>
              <h1 style={{ padding: '10px 20px', borderRadius: '30px', backgroundColor: '#2980b9', color: '#ffffff' }}>¡BIENVENIDO!</h1> <br></br>
            </center>
            <form className="custom-form"
              style={{
                borderRadius: '30px'
              }}
            >
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
                style={{ backgroundColor: '#3498db', borderColor: '#3498db', color: '#fff', padding: '10px 20px', borderRadius: '8px' }}
                className="btn btn-primary btn-block"
                onClick={handleLogin}
              >
                INICIAR SESIÓN
              </button>
              <p className="form-info">
                ¿Aún no tienes cuenta?{' '} <br></br>
                <button
                  type="button"
                  className="btn btn-link btn-register"
                  style={{
                    color: '#3498db',
                    border: '1px solid #3498db',
                    transition: 'border 0.3s',
                    padding: '10px 20px',
                    borderRadius: '8px'
                  }}
                  onMouseOver={(e) => (e.target.style.border = '1px solid transparent')}  // Borde transparente al poner el mouse
                  onMouseOut={(e) => (e.target.style.border = '1px solid #3498db')}  // Restaura el color del borde al quitar el mouse
                  onClick={() => navigate('/registroAsistente')}
                >
                  Regístrate Aquí
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;

