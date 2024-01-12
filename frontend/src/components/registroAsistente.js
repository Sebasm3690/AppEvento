import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Función para validar la cédula
function validarCedula(cedula) {
  // Verificar que la cédula tenga 10 dígitos
  if (cedula.length !== 10) {
    return false;
  }

  // Obtener los primeros 9 dígitos y el dígito verificador
  const digitos = cedula.substring(0, 9).split('').map(Number);
  const digitoVerificador = parseInt(cedula.charAt(9), 10);

  // Aplicar el algoritmo Módulo 10
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let multiplicador = (i % 2 === 0) ? 2 : 1;
    let resultado = digitos[i] * multiplicador;
    suma += (resultado > 9) ? resultado - 9 : resultado;
  }

  let modulo = suma % 10;
  let resultadoEsperado = (modulo === 0) ? 0 : 10 - modulo;

  return resultadoEsperado === digitoVerificador;
}

const Registro = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Validar la cédula
    const isValidCedula = validarCedula(data.ci);

    if (!isValidCedula) {
      setError('ci', {
        type: 'manual',
        message: 'Número de cédula inválido',
      });
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', data);
      console.log(response.data);
      alert('Gracias por tu registro, confirma tu correo para continuar');
      navigate("/loginAs/");
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
            <input {...register('ci', { 
              required: 'Campo requerido',
              validate: value => validarCedula(value) || 'Número de cédula inválido' 
            })} className="form-control" />
            {errors.ci && <p className="text-danger">{errors.ci.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;

