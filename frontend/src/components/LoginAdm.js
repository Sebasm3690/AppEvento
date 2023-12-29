import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const navigate = useNavigate();


 const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });
      console.log(response.data);
      navigate('/');
      
    } catch (err) {
      setError('Credenciales incorrectas');
    }
 };

 return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="CI"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar sesión</button>
      {error && <p>{error}</p>}
    </div>
 );
}

export default Login;