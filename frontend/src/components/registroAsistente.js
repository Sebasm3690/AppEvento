import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from "./navbar";
import Footer from "./footer";
import { FaUser, FaEnvelope, FaLock, FaIdCard } from 'react-icons/fa';
import "./styles/formRegistro.css";
import { show_alerta } from '../functions';

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
      show_alerta('Gracias por tu registro, confirma tu correo para continuar', "success");
      navigate("/loginAs/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = Array.isArray(error.response.data.error) ? error.response.data.error[0] : error.response.data.error;
        setError('email', {
          type: 'manual',
          message: errorMessage,
        });
      } else {
        setError('email', {
          type: 'manual',
          message: 'Error al registrar, verifica tus datos',
        });
      }
    }
  };

  return (
    <div>
      <NavBar />
      <div
        style={{
          paddingTop: "50px",
          paddingBottom: "50px"
        }}
      >
        <div className="col-md-6 offset-md-3">
          <div style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1589810264340-0ce27bfbf751?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZlcnRpY2FsJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww)',
            backgroundSize: 'cover',  // Ajusta el tamaño de la imagen
            width: '100%',  // Ancho del div
            height: '790px',  // Altura del div
            borderRadius: '30px',
          }}>

            <center>
              <h1 style={{ padding: '5px 20px', borderRadius: '30px', backgroundColor: '#2980b9', color: '#ffffff' }}>REGISTRO</h1> <br></br>
            </center>
            <form onSubmit={handleSubmit(onSubmit)} className="custom-form"
              style={{
                borderRadius: '30px'
              }}
            >
              <div className="mb-3">
                <label>
                  <FaUser />
                  <input {...register('nombre', { required: 'Campo requerido' })} className="form-control" placeholder="Nombre"/>
                </label>
                {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}
              </div>
              <div className="mb-3">
                <label>
                  <FaUser />
                  <input {...register('apellido', { required: 'Campo requerido' })} className="form-control" placeholder="Apellido" />
                </label>
                {errors.apellido && <p className="text-danger">{errors.apellido.message}</p>}
              </div>
              <div className="mb-3">
                <label>
                  <FaEnvelope />
                  <input {...register('email', { required: 'Campo requerido', pattern: { value: /^\S+@\S+$/i, message: 'Correo electrónico inválido' } })} className="form-control" placeholder="Correo Electrónico"/>
                </label>
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
              </div>
              <div className="mb-3">
                <label>
                  <FaLock />
                  <input type="password" {...register('password', { required: 'Campo requerido' })} className="form-control" placeholder="Contraseña"/>
                </label>
                {errors.password && <p className="text-danger">{errors.password.message}</p>}
              </div>
              <div className="mb-3">
                <label>
                  <FaIdCard />
                  <input {...register('ci', { 
                    required: 'Campo requerido',
                    validate: value => validarCedula(value) || 'Número de cédula inválido' 
                  })} className="form-control" placeholder="CI"/>
                </label>
                {errors.ci && <p className="text-danger">{errors.ci.message} </p>}
              </div>
              <button style={{ backgroundColor: '#3498db', borderColor: '#3498db', color: '#fff', padding: '10px 20px', borderRadius: '8px' }} type="submit" className="btn btn-primary">REGISTRARSE</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registro;