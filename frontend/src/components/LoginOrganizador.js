// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import Footer from "./footer";
import Dashboard from "./DashboardAdm";

const LoginOrganizador = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/loginOrg/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para enviar y recibir cookies desde el servidor
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        // Redirecciona a otra página después de iniciar sesión
        window.location.href = "/organizador/"; // Ajusta según tu estructura de rutas
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div>
      <NavBar />
      <div
        className="container mt-5"
        style={{
          paddingTop: "50px",
        }}
      >
        <div className="col-md-6 offset-md-3">
          <div
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1589810264340-0ce27bfbf751?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZlcnRpY2FsJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww)",
              backgroundSize: "cover", // Ajusta el tamaño de la imagen
              width: "100%", // Ancho del div
              height: "600px", // Altura del div
              borderRadius: "30px",
            }}
          >
            <center>
              <h1
                style={{
                  padding: "10px 20px",
                  borderRadius: "30px",
                  backgroundColor: "#2980b9",
                  color: "#ffffff",
                }}
              >
                ORGANIZADOR
              </h1>{" "}
              <br></br>
            </center>
            <form
              className="custom-form"
              style={{
                borderRadius: "30px",
              }}
            >
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
                style={{
                  backgroundColor: "#3498db",
                  borderColor: "#3498db",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
                className="btn btn-primary btn-block"
                onClick={loginUser}
              >
                INICIAR SESIÓN
              </button>
              <p className="form-info">
                ¿Eres Administrador? <br></br>
                <button
                  type="button"
                  className="btn btn-link btn-register"
                  style={{
                    color: "#3498db",
                    border: "1px solid #3498db",
                    transition: "border 0.3s",
                    padding: "10px 20px",
                    borderRadius: "8px",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.border = "1px solid transparent")
                  } // Borde transparente al poner el mouse
                  onMouseOut={(e) =>
                    (e.target.style.border = "1px solid #3498db")
                  }
                  onClick={() => navigate("/loginadm")}
                >
                  Ingresa Aquí
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginOrganizador;
