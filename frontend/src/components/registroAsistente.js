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
      navigate('/loginas');
    } catch (error) {
      setError('email', {
        type: 'manual',
        message: 'Error al registrar, verifica tus datos',
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Nombre:</label>
            <input {...register('nombre', { required: 'Campo requerido' })} className="form-control" />
            {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}
          </div>
          <div className="mb-3">
            <label>Apellido:</label>
            <input {...register('apellido', { required: 'Campo requerido' })} className="form-control" />
            {errors.apellido && <p className="text-danger">{errors.apellido.message}</p>}
          </div>
          <div className="mb-3">
            <label>Email:</label>
            <input {...register('email', { required: 'Campo requerido', pattern: { value: /^\S+@\S+$/i, message: 'Correo electrónico inválido' } })} className="form-control" />
            {errors.email && <p className="text-danger">{errors.email.message}</p>}
          </div>
          <div className="mb-3">
            <label>Password:</label>
            <input type="password" {...register('password', { required: 'Campo requerido' })} className="form-control" />
            {errors.password && <p className="text-danger">{errors.password.message}</p>}
          </div>
          <div className="mb-3">
            <label>CI:</label>
            <input {...register('ci', { required: 'Campo requerido' })} className="form-control" />
            {errors.ci && <p className="text-danger">{errors.ci.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;