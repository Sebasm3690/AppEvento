// Registro.js
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', data);
      console.log(response.data);
      navigate('/asistente');
    } catch (error) {
      setError('email', {
        type: 'manual',
        message: 'Error al registrar, verifica tus datos',
      });
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nombre:</label>
          <input {...register('nombre', { required: 'Campo requerido' })} />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>
        <div>
          <label>Apellido:</label>
          <input {...register('apellido', { required: 'Campo requerido' })} />
          {errors.apellido && <p>{errors.apellido.message}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input {...register('email', { required: 'Campo requerido', pattern: { value: /^\S+@\S+$/i, message: 'Correo electrónico inválido' } })} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register('password', { required: 'Campo requerido' })} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label>CI:</label>
          <input {...register('ci', { required: 'Campo requerido' })} />
          {errors.ci && <p>{errors.ci.message}</p>}
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;
