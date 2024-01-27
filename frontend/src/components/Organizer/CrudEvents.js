import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import DashboardGrafico from "../../components/dashboard";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import { show_alerta } from "../../functions";

import "../Organizer/indexEvents.css";

const MapaDirecciones = ({ setUbicacion, ubicacion }) => {
  const [find, setFind] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState(null);

  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/organizador/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setAdminData(data);
      } else {
        throw new Error("Error al obtener datos del Organizador");
      }
    } catch (error) {
      console.error("Error:", error);
      window.location.href = "/loginorg/";
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logoutOrg/", {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 200) {
        localStorage.removeItem("jwt");
        window.location.href = "/loginorg/";
      } else {
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const api_key = "AIzaSyAbE7OP9YJ4aV5txxvUBIYlVNizls048-4";
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          find
        )}&key=${api_key}`
      );
      const data = response.data;

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
        setFormattedAddress(data.results[0].formatted_address);
      } else {
        console.error("No se encontraron resultados de geocodificación.");
      }
    } catch (error) {
      console.error(
        "Error al obtener datos del servicio de geocodificación:",
        error
      );
    }
  };

  const loadGoogleMapsScript = () => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = googleMapsUrl;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // El script de Google Maps se ha cargado correctamente.
      };

      script.onerror = (error) => {
        console.error("Error al cargar el script de Google Maps:", error);
      };
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();

    if (window.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: latitude || 0, lng: longitude || 0 },
        zoom: 16,
      });

      if (latitude && longitude) {
        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: formattedAddress,
        });
      }
    }

    return () => {
      const script = document.querySelector(
        'script[src="' + googleMapsUrl + '"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [googleMapsUrl, latitude, longitude, formattedAddress]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 style={{ textAlign: "center" }}>
              Dirección de la Ubicación del Evento
            </h2>
            <br />
            <form
              className="form-inline"
              onSubmit={handleSubmit}
              style={{ textAlign: "center" }}
            >
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="find"
                  id="find"
                  placeholder="Pais/Ciudad, Direccion"
                  value={ubicacion}
                  onChange={(e) => {
                    setFind(e.target.value);
                    setUbicacion(e.target.value);
                  }}
                />
              </div>
              <input className="btn btn-primary" type="submit" value="Buscar" />
            </form>
            <br />
            <div style={{ textAlign: "center" }}>
              <kbd>
                <kbd>Latitude:</kbd>
                {latitude}, <kbd>Longitude:</kbd>
                {longitude}
              </kbd>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div id="map" style={{ height: "450px", width: "450px" }}></div>
        </div>
      </div>
    </>
  );
};

const CrudEvents = ({ organizerObj }) => {
  const navigate = useNavigate();
  const estiloModal = {
    maxWidth: "80%",
    width: "auto",
  };
  const url = "http://127.0.0.1:8000/api/v1/event/";
  const url_boleto = "http://127.0.0.1:8000/api/v1/ticket/";
  const url_venta = "http://127.0.0.1:8000/api/api/v1/vende/";
  const url_contiene = "http://127.0.0.1:8000/api/api/v1/contieneqr/";
  const url_orden_compra = "http://127.0.0.1:8000/api/api/v1/OrdenCompra/";
  const url_asistente = "http://127.0.0.1:8000/api/api/v1/Asistente/";
  /*Evento */
  const [opcion, setOpcion] = useState(1);
  const [events, setEvents] = useState([]);
  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [gasto, setGasto] = useState(0);
  /*Boleto*/
  const [boletos, setBoletos] = useState([]);
  const [idBoleto, setIdBoleto] = useState(0);
  const [stock, setStock] = useState(0);
  const [tipoBoleto, setTipoBoleto] = useState("");
  const [precio, setPrecio] = useState(0);
  const [idEventoBoleto, setIdEventoBoleto] = useState(0);

  const [limite, setLimite] = useState(0);
  //const [image, setImage] = useState("");

  /*Venta*/
  const [ventas, setVentas] = useState([]);
  const [iva, setIva] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [precio_actual, setPrecioActual] = useState(0);

  const [id_organizador, setIdOrganizador] = useState(
    organizerObj.id_organizador
  );

  /*Contiene*/

  const [contienes, setContienes] = useState([]);
  const [contienesFiltrados, setContienesFiltrados] = useState([]);
  const [id_contiene, setIdContiene] = useState(0);
  /*Orden compra*/
  const [ordenesCompra, setOrdenCompras] = useState([]);
  const [ordenesCompraFiltradas, setOrdenCompraFiltradas] = useState([]);
  const [num_orden_compra, setnumOrdenCompra] = useState(0);

  /*Asistente*/

  const [asistentes, setAsistentes] = useState([]);
  const [id_asistente, setIdAsistente] = useState(0);

  /*Diseño*/
  const [stockActual, setStockActual] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalInsert, setShowModalInsert] = useState(false);
  const [showModalBoleto, setShowModalBoleto] = useState(false);
  const [showModalBoletoIngresar, setShowModalBoletoIngresar] = useState(false);
  const [showModalImpuestosIngresar, setShowModalImpuestosIngresar] =
    useState(false);
  const [showModalBoletoRegresar, setShowModalBoletoRegresar] = useState(false);
  const [showModalRecuperar, setShowModalRecuperar] = useState(false);
  const [showModalOrdenCompra, setShowModalOrdenCompra] = useState(false);
  const [showModalAsistente, setShowModalAsistente] = useState(false);
  const [showModalContiene, setShowModalContiene] = useState(false);
  const [step, setStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModalDelete, setShowConfirmModalDelete] = useState(false);
  /*Imagen*/
  const [imagen, setImagen] = useState(null);
  const [eventImages, setEventImages] = useState({});

  /*Mapa*/
  const [mostrarMapa, setMostrarMapa] = useState(false);

  //Función para consumir API y obtener todo el objeto {}

  useEffect(() => {
    getEvents();
    handleEliminarEventoPasado();
  }, []);

  const getEvents = async () => {
    const respuesta = await axios.get(url);
    setEvents(respuesta.data);
    const respuestaBoleto = await axios.get(url_boleto);
    setBoletos(respuestaBoleto.data);
    const respuestaVenta = await axios.get(url_venta);
    setVentas(respuestaVenta.data);
    const respuestaContiene = await axios.get(url_contiene);
    setContienes(respuestaContiene.data);
    const respuestaOrdenCompra = await axios.get(url_orden_compra);
    setOrdenCompras(respuestaOrdenCompra.data);
    const respuestaAsistente = await axios.get(url_asistente);
    setAsistentes(respuestaAsistente.data);
    if (respuestaVenta.data.length > 0) {
      setIva(respuestaVenta.data[0].iva);
    }
  };

  const handleEditarBoleto = () => {
    setShowModalBoleto(true);
    const boletosEvento = boletos.find((boleto) => boleto.id_evento === id); //Se muestran solo los boletos que corresponden a dicho evento
    const vendeBoleto = ventas.find(
      (venta) => venta.id_boleto === boletosEvento.id_boleto
    );

    if (boletosEvento) {
      //alert("Si se encontró");
      setIdBoleto(boletosEvento.id_boleto);
      setStock(boletosEvento.stock);
      setTipoBoleto(boletosEvento.tipoBoleto);
      setPrecio(vendeBoleto.precio_actual);
      setShowModalBoleto(true);
    }
  };

  const handleEditarEvento = (eventId) => {
    setShowModal(true);
    const evento = events.find((event) => event.id_evento === eventId);
    if (evento) {
      setId(evento.id_evento);
      setNombre(evento.nombre_evento);
      setFecha(evento.fecha);
      setHora(evento.hora);
      setGasto(evento.gasto);
      setUbicacion(evento.ubicacion);
      setDescripcion(evento.descripcion);
      setTipo(evento.tipo);
      setLimite(evento.limite);
      //setImage(evento.image);
      setShowModal(true);
    }
  };

  const handleEliminarEventoPasado = async () => {
    const fechaActual = new Date();

    //Aqui me retorna evento por evento cada evento que tenga la fecha del evento menor a la fecha actual
    const eventosPasados = events.filter((event) => {
      const fechaEvento = new Date(event.fecha);
      return fechaEvento <= fechaActual;
    });

    // Eliminación lógica del evento pasado
    const eliminacionesLogicas = eventosPasados.map((eventoPasado) =>
      axios.post(
        `http://127.0.0.1:8000/borrado_logico_evento/${eventoPasado.id_evento}/`
      )
    );

    // Esperar a que todas las eliminaciones lógicas se completen antes de obtener los eventos actualizados
    await Promise.all(eliminacionesLogicas);

    setEvents((prevEvents) =>
      prevEvents.filter((prevEvent) => {
        const fechaPrevEvento = new Date(prevEvent.fecha);
        return fechaPrevEvento > fechaActual; // Mantener solo los eventos futuros
      })
    );
  };

  const handleEliminarEvento = async (eventId) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/borrado_logico_evento/${eventId}/`
      );
      //Acutalizar lista de eventos despues del borrado lógico
      setEvents((prevEvents) =>
        prevEvents.filter((prevEvent) => prevEvent.id_evento !== eventId)
      );
      if (response.status === 200) {
        show_alerta(response.data.message, "success");
      } else {
        show_alerta(response.data.message, "warning");
      }
    } catch (error) {
      if (error.response) {
        show_alerta(
          "No se puede borrar el evento ya que en el evento seleccionado ya se han comprado boletos",
          "warning"
        );
      } else {
        console.error("Error al intentar borrar el evento:", error);
      }
    }
  };

  /*Imágen*/

  /*const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      axios
        .post("http://127.0.0.1:8000/api/v1/upload/", formData)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);
          setImage(response.data.url); // Asume que el servidor devuelve la URL de la imagen
        })
        .catch((error) => {
          console.error("Error al cargar la imagen:", error);
        });
    }
  };*/

  /*Imágen Actualizar*/

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/event/");
      setEvents(response.data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  const handleImageChange = async (e, eventId) => {
    const file = e.target.files[0];

    if (!file || !isValidImage(file)) {
      show_alerta("Por favor, seleccione una imagen PNG o JPG.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/v1/event/${eventId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      cargarEventos();
      show_alerta("Imagen Actualizada Exitosamente", "success");
    } catch (error) {
      console.error("Error al enviar la imagen:", error);
    }
  };

  const isValidImage = (file) => {
    if (!file) {
      return false;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    return allowedTypes.includes(file.type);
  };

  const validarBoletoEditar = async (op) => {
    const urlEditar = `http://127.0.0.1:8000/api/v1/ticket/${idBoleto}/`;
    var parametrosBoleto;

    if (stock > limite) {
      show_alerta(
        "El stock de boletos debe tener como máximo limite de asistentes para el evento" +
          "en este caso " +
          limite +
          " boletos",
        "warning"
      );
      return;
    } else if (tipoBoleto === "") {
      show_alerta("Escribe el tipo de boleto", "warning");
    } else if (precio <= 0) {
      show_alerta("El precio del boleto debe ser mayor a 0", "warning");
      return;
    }

    parametrosBoleto = {
      stock: stock,
      tipoBoleto: tipoBoleto,
      precio: precio,
      id_evento: id, //Se queda igual por el editar de evento
    };

    axios
      .put(urlEditar, parametrosBoleto)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        show_alerta("El boleto ha sido editado exitosamente", "success");
        setShowModalBoleto(false);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud PUT:", error);
      });
  };

  //Aqui está el error
  const handleIngresarVenta = async (boletoNuevo) => {
    const parametrosString = JSON.stringify(boletoNuevo, null, 2);
    setBoletos((boletosAnteriores) => [...boletosAnteriores, parametrosString]);
    // Convertir el objeto a una cadena JSON

    // Mostrar un alert con la información del objeto
    //const boletosJson = JSON.stringify(boletos, null, 2);
    //alert(boletosJson);
    var parametrosVenta;
    setPrecioActual(precio);

    parametrosVenta = {
      id_boleto: boletoNuevo.id_boleto,
      iva: iva,
      descuento: 0,
      stock_actual: boletoNuevo.stock,
      precio_actual: precio, //El precio le toma del boleto con impuesto
      id_organizador: id_organizador,
    };

    axios
      .post(url_venta, parametrosVenta)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        show_alerta("Boleto listo para vender", "success");
        setVentas((ventas) => [...ventas, response.data]);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST VENTA:", error);
      });
    setShowModalBoletoIngresar(false);
  };

  const validarBoletoIngresar = async () => {
    var parametrosBoleto;

    if (stock > limite) {
      show_alerta(
        "El stock de boletos debe ser menor o igual al limite de asistentes para el evento, " +
          "en este caso " +
          limite +
          " boletos",
        "warning"
      );
      return;
    } else if (tipo.trim() === "") {
      show_alerta("Escribe el tipo de boleto", "warning");
    } else if (precio <= 0) {
      show_alerta("El precio del boleto debe ser mayor a 0", "warning");
      return;
    }

    const apiConfig = {
      boleto: {
        tipo: "tipoBoleto",
      },
    };

    parametrosBoleto = {
      stock: parseInt(stock),
      [apiConfig.boleto.tipo]: tipoBoleto.trim(),
      precio: precio,
      id_evento: idEventoBoleto, //El valor se toma del response.data.id_evento del "const validar" en la opción 1 al insertar el evento
    };

    axios
      .post(`http://127.0.0.1:8000/vendeBoleto/`, parametrosBoleto)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        show_alerta("El boleto ha sido agregado exitosamente", "success");
        setBoletos((boletos) => [...boletos, response.data]);
        handleIngresarVenta(response.data);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST:", error);
      });
    setShowModalBoletoIngresar(false);
    setStep((s) => s - 1);

    // Configurar el temporizador
  };

  /*********************************/

  const validarImpuestoEditar = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/Update_iva_ice/`,
        {
          iva: iva,
        }
      );
      show_alerta(
        response.data?.message || "Error al actualizar los impuestos",
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar impuestos:", error);
      show_alerta("Error al actualizar los impuestos", "error");
    }
  };

  /*const recuperar_evento = async (id_evento) => {
    await axios.post(
      `http://127.0.0.1:8000/recuperar_evento/${id_evento}/`,
      show_alerta("El evento ha sido recuperado correctamente", "success")
    );
    setEvents((prevEvents) =>
      prevEvents.filter((prevEvent) => prevEvent.id_evento !== id_evento)
    );
  };*/

  const validar = async (op) => {
    var parametros;
    const fechaActual = new Date();
    const fechaEvento = new Date(fecha);
    const urlEditar = `http://127.0.0.1:8000/api/v1/event/${id}/`;
    //var metodo;
    if (nombre.trim() === "") {
      show_alerta("Escribe el nombre del evento", "warning");
    } else if (fecha === "") {
      show_alerta("Escribe la fecha del evento", "warning");
    } else if (!hora || hora.trim().length === 0) {
      show_alerta("Escribe la hora del evento", "warning");
    } else if (ubicacion.trim() === "") {
      show_alerta("Escribe la ubicación del evento", "warning");
    } else if (descripcion.trim() === "") {
      show_alerta("Escribe la descripción del evento", "warning");
    } else if (tipo.trim() === "") {
      show_alerta("Escribe el tipo de evento", "warning");
      if (gasto === 0) {
        show_alerta("Escribe gasto para realizar el evento", "warning");
      }
    } else if (limite <= 20) {
      show_alerta(
        "El límite del evento debe ser de mas de 20 personas",
        "warning"
      );
      return;
      //} else if (image === "") {
      //show_alerta("Agrega una imágen al evento", "warning");
    } else if (id_organizador === "") {
      show_alerta("Escribe el id del organizador", "warning");
    } else if (fechaEvento.getTime() <= fechaActual.getTime()) {
      //alert(1);
      show_alerta("La fecha debe ser mayor a la fecha actual", "warning");
      return;
    }

    if (op === 1) {
      if (
        events
          .filter((event) => event.eliminado === false)
          .some((event) => event.ubicacion === ubicacion)
      ) {
        show_alerta("Ya existe un evento con esa misma ubicación", "warning");
        return;
      } else if (
        events
          .filter((event) => event.eliminado === false)
          .some((event) => event.nombre_evento === nombre)
      ) {
        show_alerta(
          "Ya existe un evento con el nombre del evento ingresado",
          "warning"
        );
        return;
      }

      parametros = {
        nombre_evento: nombre.trim(),
        fecha,
        hora,
        gasto,
        ubicacion: ubicacion.trim(),
        descripcion: descripcion.trim(),
        tipo: tipo.trim(),
        limite,
        //image,
        id_organizador,
      };

      // Convertir el objeto a una cadena JSON
      //const parametrosString = JSON.stringify(parametros, null, 2);

      // Mostrar un alert con la información del objeto
      //alert(parametrosString);

      //metodo = "POST";
      console.log("Parámetros que se enviarán:", parametros);
      axios
        .post(url, parametros)
        .then((response) => {
          setIdEventoBoleto(response.data.id_evento);
          console.log("Respuesta del servidor:", response.data);
          show_alerta("El evento ha sido agregado exitosamente", "success");
          setEvents((events) => [...events, response.data]);
          setShowModalInsert(false);
          setShowModalBoletoIngresar(true);
          setStep((s) => s + 1);
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud POST:", error);
        });
    } else {
      parametros = {
        nombre_evento: nombre.trim(),
        fecha: fecha,
        hora: hora,
        gasto: gasto,
        ubicacion: ubicacion.trim(),
        descripcion: descripcion.trim(),
        tipo: tipo.trim(),
        limite: limite,
        //image,
        id_organizador: id_organizador,
      };
      //metodo = "PUT";

      axios
        .put(urlEditar, parametros)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);
          show_alerta("El evento ha sido actualizado exitosamente", "success");
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud PUT:", error);
        });
      setShowModal(false);
      handleEditarBoleto();
    }
    //enviarSolicitud(metodo, parametros);
  };

  const mostrarOrdenCompra = async (id_evento) => {
    //Aqui guarda el Id de orden compra con el set, para luego mostrar en la tabla filtrando la ordenCompra y solamente mostrando las que posean el ID de las ordenes compras que coincidan con el evento, boleto y contiene
    setShowModalOrdenCompra(true);
    var boletoEvento = boletos.find((boleto) => boleto.id_evento === id_evento);

    if (!boletoEvento) {
      setOrdenCompraFiltradas([]);
      return;
    }

    const contieneBoletos = contienes.filter(
      (contiene) => contiene.id_boleto === boletoEvento.id_boleto
    );

    const numerosOrdenContiene = contieneBoletos.map(
      (contiene) => contiene.num_orden
    );

    var ordenCompraContiene = ordenesCompra.filter((ordenCompra) =>
      numerosOrdenContiene.includes(ordenCompra.num_orden)
    );

    /*if (!ordenCompraContiene) {
      console.log("No hay orden compra para el contiene");
      setOrdenCompraFiltradas([]);
      return;
    }*/

    setOrdenCompraFiltradas(ordenCompraContiene);
    //setContienesFiltrados(contieneBoletos);
  };

  var mostrar_contiene = (num_orden) => {
    var contieneOrdenCompra;
    setShowModalContiene(true);
    contieneOrdenCompra = contienes.filter(
      (contiene) => contiene.num_orden === num_orden
    );
    setContienesFiltrados(contieneOrdenCompra);
  };

  var ver_asistente = (ordenCompra) => {
    setShowModalAsistente(true);
    if (Array.isArray(asistentes)) {
      var asistenteNumOrden = asistentes.find(
        (asistente) => asistente.id_asistente === ordenCompra.id_asistente
      );
      setAsistentes(asistenteNumOrden);
    } else {
      console.error("La variable 'asistentes' no es un array.");
    }
  };

  function handleMapa() {
    setMostrarMapa(true);
  }

  return (
    <>
      <Container className="meetup-item">
        <div style={{ paddingBlockEnd: "50px" }}>
          <button
            style={{
              backgroundColor: "#2980b9",
              borderColor: "#2980b9",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
            className="btn btn-primary"
            onClick={() => setShowModalInsert(true)}
          >
            NUEVO EVENTO
          </button>

          <span style={{ margin: "0 40px" }}></span>
          {events.some(
            (evento) =>
              evento.eliminado === false &&
              boletos.some((boleto) => evento.id_evento === boleto.id_evento)
          ) && (
            <button
              className="btn btn-info"
              style={{
                backgroundColor: "#3498db",
                borderColor: "#3498db",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
              onClick={() => setShowModalImpuestosIngresar(true)}
            >
              AGREGAR IMPUESTOS
            </button>
          )}
          <span style={{ margin: "0 40px" }}></span>
          <button
            style={{
              backgroundColor: "#6aabb5",
              borderColor: "#6aabb5",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
            className="btn btn-success"
            onClick={() => setShowModalRecuperar(true)}
          >
            {/*Recuperar evento*/}
            HISTÓRICO
          </button>
          <button
            style={{
              backgroundColor: "#2980b9",
              borderColor: "#2980b9",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
            className="btn btn-primary"
            onClick={() => navigate("/dashboardGeneral/")}
          >
            VER DASHBOARD GENERAL
          </button>
        </div>

        <Table className="table table-borderless">
          <thead className="">
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Gasto del evento</th>
              <th>Ubicación</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Límite</th>
              <th>Imagen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events
              .filter(
                (event) => event.id_organizador === organizerObj.id_organizador
              )
              .filter((event) => event.eliminado === false)
              //.filter((event) => new Date() > new Date(event.fecha))
              .map((event) => (
                <tr key={event.id_evento}>
                  <td>{event.nombre_evento}</td>
                  <td>{event.fecha}</td>
                  <td>{event.hora}</td>
                  <td>{event.gasto}</td>
                  <td>{event.ubicacion}</td>
                  <td>{event.descripcion}</td>
                  <td>{event.tipo}</td>
                  <td>{event.limite}</td>

                  <td>
                    <img
                      key={event.imagen}
                      src={event.imagen}
                      alt={`Imagen para el evento ${event.id_evento}`}
                      style={{ maxWidth: "95px" }}
                    />
                    <input
                      className="form-control"
                      name={`imagen-${event.id_evento}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, event.id_evento)}
                      style={{
                        marginTop: "3px",
                        maxWidth: "99px",
                        padding: "7px, 14px",
                        borderRadius: "8px",
                      }}
                    />
                  </td>

                  <td>
                    <button
                      style={{
                        color: "#fff",
                        padding: "7px 14px",
                        borderRadius: "8px",
                      }}
                      onClick={() => handleEditarEvento(event.id_evento)}
                      className="btn btn-warning"
                    >
                      <img
                        src={
                          "https://cdn-icons-png.flaticon.com/512/1827/1827933.png"
                        }
                        alt="Editar"
                        width={"25px"}
                      />
                      <span style={{ margin: "0 0px" }}></span>
                    </button>
                    <span style={{ margin: "0 3px" }}></span>
                    <button
                      style={{
                        color: "#fff",
                        padding: "7px 14px",
                        borderRadius: "8px",
                      }}
                      className="btn btn-danger"
                      onClick={() => {
                        setShowConfirmModalDelete(true);
                        setId(event.id_evento);
                      }}
                    >
                      <img
                        src={
                          "https://cdn-icons-png.flaticon.com/512/3221/3221845.png"
                        }
                        alt="Editar"
                        width={"25px"}
                      />
                      <span style={{ margin: "0 0px" }}></span>
                    </button>
                    <span style={{ margin: "0 0px" }}></span>

                    <button
                      style={{
                        backgroundColor: "#17A2B8",
                        color: "#fff",
                        padding: "7px 14px",
                        borderRadius: "8px",
                      }}
                      type="button"
                      class="btn btn-primary"
                      onClick={() => mostrarOrdenCompra(event.id_evento)}
                    >
                      <img
                        src={
                          "https://cdn-icons-png.flaticon.com/512/46/46155.png"
                        }
                        alt="Editar"
                        width={"25px"}
                      />
                      <span style={{ margin: "0 0px" }}></span>
                      <span class="badge bg-secondary"></span>
                    </button>
                  </td>
                  <td>
                    <Button
                      style={{
                        backgroundColor: "#2980b9",
                        borderColor: "#2980b9",
                        padding: "10px 20px",
                        borderRadius: "8px",
                      }}
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/dashboardGrafico/${event.id_evento}`)
                      }
                    >
                      VER DASHBOARD
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>

      {/*Ventana modal*/}

      <Modal isOpen={showModal}>
        <div style={{ marginTop: "50px" }}>
          <button
            className="close"
            style={{ position: "absolute", left: "16px", top: "16px" }}
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>

          <div className="active"></div>
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
          </div>
        </div>

        <ModalHeader
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <h3>EDITAR EVENTO</h3>
          </div>
        </ModalHeader>

        {/* Vista previa de la imagen }

        {image && (
          <img
            src={image}
            alt="Imagen de vista previa"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}

        {----------------------------*/}

        <ModalBody>
          <FormGroup>
            <label>ID:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_evento" //e es nuestro evento o lo que ingresa el usuario, con target apuntamos al valor ingresado por el usuario y se actualiza el objeto gracias al método set
              value={id}
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre_evento"
              type="text"
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Fecha:</label>
            <input
              className="form-control"
              name="fecha"
              type="date"
              onChange={(e) => setFecha(e.target.value)}
              value={fecha}
            />
          </FormGroup>

          <FormGroup>
            <label>Hora:</label>
            <input
              className="form-control"
              name="hora"
              type="time"
              onChange={(e) => setHora(e.target.value)}
              value={hora}
            />
          </FormGroup>

          <FormGroup>
            <label>Gasto:</label>
            <input
              className="form-control"
              name="gasto"
              type="number"
              onChange={(e) => setGasto(e.target.value)}
              value={gasto}
            />
          </FormGroup>

          <FormGroup>
            <label>Ubicación:</label>
            <input
              className="form-control"
              name="ubicacion"
              type="text"
              onChange={(e) => setUbicacion(e.target.value)}
              value={ubicacion}
            />
          </FormGroup>

          <FormGroup>
            <label>Tipo:</label>
            <input
              className="form-control"
              name="tipo"
              type="text"
              onChange={(e) => setTipo(e.target.value)}
              value={tipo}
            />
          </FormGroup>

          <FormGroup>
            <label>Descripción:</label>
            <input
              className="form-control"
              name="descripcion"
              type="text"
              onChange={(e) => setDescripcion(e.target.value)}
              value={descripcion}
            />
          </FormGroup>

          <FormGroup>
            <label>Límite:</label>
            <input
              className="form-control"
              name="limite"
              type="number"
              onChange={(e) => setLimite(e.target.value)}
              value={limite}
            />
          </FormGroup>

          <MapaDirecciones />
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              validar(2);
              setStep((s) => s + 1);
            }}
          >
            Siguiente
          </Button>
          <Button color="danger" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      {/*-------------Insertar Evento---------------- */}

      <Modal isOpen={showModalInsert}>
        <div style={{ marginTop: "50px" }}>
          <button
            className="close"
            style={{ position: "absolute", left: "16px", top: "16px" }}
            onClick={() => setShowModalInsert(false)}
          >
            &times;
          </button>

          <div className="active"></div>
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
          </div>
        </div>

        <ModalHeader
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <h3>INSERTAR EVENTO</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              name="nombre_evento"
              type="text"
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Fecha:</label>
            <input
              className="form-control"
              name="fecha"
              type="date"
              onChange={(e) => setFecha(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Hora:</label>
            <input
              className="form-control"
              name="hora"
              type="time"
              onChange={(e) => setHora(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Gasto:</label>
            <input
              className="form-control"
              name="gasto"
              type="number"
              onChange={(e) => setGasto(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Descripción:</label>
            <input
              className="form-control"
              name="descripcion"
              type="text"
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Tipo:</label>
            <input
              className="form-control"
              name="tipo"
              onChange={(e) => setTipo(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Límite:</label>
            <input
              className="form-control"
              name="limite"
              type="number"
              style={{ width: "18%" }}
              onChange={(e) => setLimite(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <MapaDirecciones
              setUbicacion={setUbicacion}
              ubicacion={ubicacion}
            />
          </FormGroup>

          {/*<FormGroup>
            <label>Imágen:</label>
            <input
              className="form-control"
              name="image"
              type="file"
              accept="image/"
              onChange={handleImageUpload}
            />
    </FormGroup>*/}
        </ModalBody>

        <ModalFooter>
          <Button
            className="buttons"
            style={{ background: "#7950f2", color: "#fff" }}
            color="primary"
            onClick={() => setShowConfirmModal(true)}
          >
            Siguiente
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Modal Boleto Editar-------------------*/}

      {/*Ventana modal*/}

      {/*boletos.filter(boleto).map((boleto) => boleto.id_organizador)*/}

      <Modal isOpen={showModalBoleto}>
        <div style={{ marginTop: "50px" }}>
          <button
            className="close"
            style={{ position: "absolute", left: "16px", top: "16px" }}
            onClick={() => setShowModalBoleto(false)}
          >
            &times;
          </button>

          <div className="active"></div>
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
          </div>
        </div>

        <ModalHeader
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <h3>EDITAR BOLETO</h3>
          </div>
        </ModalHeader>

        {/* Vista previa de la imagen }

        {image && (
          <img
            src={image}
            alt="Imagen de vista previa"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}

        {----------------------------*/}

        <ModalBody>
          <FormGroup>
            <label>ID:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_evento" //e es nuestro evento o lo que ingresa el usuario, con target apuntamos al valor ingresado por el usuario y se actualiza el objeto gracias al método set
              value={idBoleto}
            />
          </FormGroup>

          <FormGroup>
            <label>Stock:</label>
            <input
              className="form-control"
              name="nombre_evento"
              type="text"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
            />
          </FormGroup>
          <FormGroup>
            <label>Tipo:</label>
            <select
              className="form-control"
              name="tipo"
              value={tipoBoleto}
              onChange={(e) => setTipoBoleto(e.target.value)}
            >
              <option value="">Seleccione un tipo</option>
              <option value="Tipo1">VIP</option>
              <option value="Tipo2">Normal</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Precio:</label>
            <input
              className="form-control"
              name="precio"
              type="money"
              onChange={(e) => setPrecio(e.target.value)}
              value={precio}
            />
          </FormGroup>

          <FormGroup>
            <label>ID Evento:</label>
            <input
              className="form-control"
              name="id"
              type="money"
              onChange={(e) => setIdEventoBoleto(e.target.value)}
              value={id}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              validarBoletoEditar();
              setStep((s) => s - 1);
            }}
          >
            Finalizar
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Modal Ingresar Boleto-------------------*/}

      {/*Ventana modal*/}

      <Modal isOpen={showModalBoletoIngresar}>
        <div style={{ marginTop: "50px" }}>
          <button
            className="close"
            style={{ position: "absolute", left: "16px", top: "16px" }}
            onClick={() => setShowModalInsert(false)}
          >
            &times;
          </button>

          <div className="active"></div>
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
          </div>
        </div>

        <ModalHeader>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>INGRESAR BOLETO</h3>
          </div>
        </ModalHeader>

        {/* Vista previa de la imagen }

        {image && (
          <img
            src={image}
            alt="Imagen de vista previa"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}

        {----------------------------*/}

        <ModalBody>
          <FormGroup>
            <label>Stock:</label>
            <input
              className="form-control"
              name="stock"
              type="text"
              onChange={(e) => setStock(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <label>Tipo:</label>
            <select
              className="form-control"
              name="tipo"
              onChange={(e) => setTipoBoleto(e.target.value)}
            >
              <option value="">Seleccione un tipo</option>
              <option value="Tipo1">VIP</option>
              <option value="Tipo2">Normal</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Precio:</label>
            <input
              className="form-control"
              name="precio"
              type="money"
              onChange={(e) => setPrecio(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>ID Evento:</label>
            <input
              className="form-control"
              name="number"
              type="money"
              value={idEventoBoleto}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            style={{
              background: "#7950f2",
              color: "#fff",
            }}
            onClick={() => validarBoletoIngresar()}
          >
            Finalizar
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Modal Impuestos Editar-------------------*/}

      {/*Ventana modal*/}

      <Modal isOpen={showModalImpuestosIngresar}>
        <ModalHeader>
          <div>
            <h3>INGRESAR IMPUESTOS</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>IVA:</label>
            <input
              className="form-control"
              name="iva"
              type="money"
              onChange={(e) => setIva(Number(e.target.value))}
              value={iva}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validarImpuestoEditar()}>
            Finalizar
          </Button>
          <Button
            color="btn btn-danger"
            onClick={() => setShowModalImpuestosIngresar(false)}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Recuperar evento-------------------*/}
      <Modal isOpen={showModalRecuperar} size="lg" style={estiloModal}>
        <ModalHeader>
          <div>
            <h3>HISTÓRICO</h3>
            <Button
              type="button"
              className="close" // Agregar la clase "float-right" para alinear a la derecha
              aria-label="close"
              onClick={() => setShowModalRecuperar(false)}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </div>
        </ModalHeader>

        <Container>
          <Table className="table">
            <thead>
              <tr>
                <th>ID Evento</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Gasto del evento</th>
                <th>Ubicación</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Límite</th>
                {/*<th>Imágen</th>*/}
              </tr>
            </thead>
            <tbody>
              {events
                .filter(
                  (event) =>
                    event.id_organizador === organizerObj.id_organizador
                )
                .filter((event) => event.eliminado === true)
                //.filter((event) => new Date() < new Date(event.fecha))
                .map((event) => (
                  <tr key={event.id_evento}>
                    <td>{event.id_evento}</td>
                    <td>{event.nombre_evento}</td>
                    <td>{event.fecha}</td>
                    <td>{event.hora}</td>
                    <td>{event.gasto}</td>
                    <td>{event.ubicacion}</td>
                    <td>{event.descripcion}</td>
                    <td>{event.tipo}</td>
                    <td>{event.limite}</td>

                    {/*}<td>
                    {" "}
                    {image && (
                      <img
                        src={event.image}
                        alt="Imagen de vista previa"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    )}
                    </td>*/}

                    <td>
                      {/*{" "}*/}
                      {/*<Button
                        className="btn btn-success"
                        onClick={() => recuperar_evento(event.id_evento)}
                      >
                        Recuperar Evento
                  </Button>*/}
                      <td>
                        <Button
                          className="btn btn-info"
                          onClick={() => mostrarOrdenCompra(event.id_evento)}
                        >
                          Ver Orden de compra
                        </Button>{" "}
                        <Button
                          style={{
                            backgroundColor: "#2980b9",
                            borderColor: "#2980b9",
                            padding: "10px 20px",
                            borderRadius: "8px",
                          }}
                          className="btn btn-primary"
                          onClick={() =>
                            navigate(`/dashboardGrafico/${event.id_evento}`)
                          }
                        >
                          VER DASHBOARD
                        </Button>
                      </td>

                      <br></br>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Container>
      </Modal>

      {/*----------------Mostrar Orden Compra-------------------*/}

      <Modal isOpen={showModalOrdenCompra} size="lg" style={estiloModal}>
        <ModalHeader>
          <div>
            <h3>ORDEN DE COMPRA</h3>
            <Button
              type="button"
              className="close"
              aria-label="close"
              onClick={() => setShowModalOrdenCompra(false)}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </div>
        </ModalHeader>

        <Container>
          <Table className="table">
            <thead>
              <tr>
                <th>Número de Orden</th>
                <th>Fecha</th>
                <th>Valor Total</th>
                <th>IVA</th>
                {/*<th>Imágen</th>*/}
              </tr>
            </thead>
            <tbody>
              {ordenesCompraFiltradas.map((ordenCompra) => (
                <tr key={ordenCompra.num_orden}>
                  <td>{ordenCompra.num_orden}</td>
                  <td>{ordenCompra.fecha}</td>
                  <td>{ordenCompra.valor_total + "$"}</td>
                  <td>{iva + "%"}</td>

                  {/*}<td>
                    {" "}
                    {image && (
                      <img
                        src={event.image}
                        alt="Imagen de vista previa"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    )}
                    </td>*/}

                  <td>
                    {/*{" "}*/}
                    <Button
                      className="btn btn-info"
                      onClick={() => mostrar_contiene(ordenCompra.num_orden)}
                    >
                      Ver boleto
                    </Button>{" "}
                    <Button
                      className="btn btn-success"
                      onClick={() => ver_asistente(ordenCompra)}
                    >
                      Ver asistente
                    </Button>
                    <br></br>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Modal>

      {/*----------------Mostrar Orden Compra-------------------*/}

      <Modal isOpen={showModalContiene}>
        <ModalHeader>
          <div>
            <h3>Boleto comprado</h3>
            <Button
              type="button"
              className="close"
              aria-label="close"
              onClick={() => setShowModalContiene(false)}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </div>
        </ModalHeader>

        <Container>
          <Table className="table">
            <thead>
              <tr>
                <th>Código boleto</th>
                <th>Boletos comprados</th>
                <th>num_orden</th>
              </tr>
            </thead>
            <tbody>
              {contienesFiltrados.map((contieneFiltrado) => (
                <tr key={contieneFiltrado.id_contiene}>
                  <td>{contieneFiltrado.boleto_cdg}</td>
                  <td>{contieneFiltrado.cantidad_total}</td>
                  <td>{contieneFiltrado.num_orden}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Modal>

      {/*Ventana modal asistente*/}

      <Modal isOpen={showModalAsistente}>
        <ModalHeader>
          <div>
            <h3>Asistente</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_asistente" //e es nuestro evento o lo que ingresa el usuario, con target apuntamos al valor ingresado por el usuario y se actualiza el objeto gracias al método set
              value={asistentes.id_asistente}
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              readOnly
              name="nombre_asistente"
              type="text"
              value={asistentes.nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Apellido:</label>
            <input
              className="form-control"
              readOnly
              name="apellido"
              type="text"
              value={asistentes.apellido}
            />
          </FormGroup>

          <FormGroup>
            <label>Correo:</label>
            <input
              className="form-control"
              readOnly
              name="correo"
              type="text"
              value={asistentes.email}
            />
          </FormGroup>

          <FormGroup>
            <label>CI:</label>
            <input
              className="form-control"
              readOnly
              name="ubicacion"
              type="text"
              value={asistentes.ci}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" onClick={() => setShowModalAsistente(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/*-----------Ventana modal preguntar Insertar Evento-----------*/}

      <Modal isOpen={showConfirmModal}>
        <ModalHeader>
          <h3>Confirmación</h3>
        </ModalHeader>
        <ModalBody>
          <p>¿Estás seguro de ingresar estos valores?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn btn-success"
            onClick={() => {
              setShowConfirmModal(false);
              validar(opcion);
            }}
          >
            Sí
          </Button>
          <Button
            className="btn btn-error"
            onClick={() => setShowConfirmModal(false)}
          >
            No
          </Button>
        </ModalFooter>
      </Modal>

      {/*-------Ventana modal preguntar dar de baja evento -------*/}

      <Modal isOpen={showConfirmModalDelete}>
        <ModalHeader>
          <h3>Confirmación</h3>
        </ModalHeader>
        <ModalBody>
          <p>¿Estás seguro de dar de baja dicho evento?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn btn-success"
            onClick={() => {
              setShowConfirmModalDelete(false);
              handleEliminarEvento(id);
            }}
          >
            Sí
          </Button>
          <Button
            className="btn btn-error"
            onClick={() => setShowConfirmModalDelete(false)}
          >
            No
          </Button>
        </ModalFooter>
      </Modal>
      {/*Ventana modal mapa*/}
      <Modal isOpen={showModalAsistente}>
        <ModalHeader>
          <div>
            <h3>Asistente</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_asistente" //e es nuestro evento o lo que ingresa el usuario, con target apuntamos al valor ingresado por el usuario y se actualiza el objeto gracias al método set
              value={asistentes.id_asistente}
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre:</label>
            <input
              className="form-control"
              readOnly
              name="nombre_asistente"
              type="text"
              value={asistentes.nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>Apellido:</label>
            <input
              className="form-control"
              readOnly
              name="apellido"
              type="text"
              value={asistentes.apellido}
            />
          </FormGroup>

          <FormGroup>
            <label>Correo:</label>
            <input
              className="form-control"
              readOnly
              name="correo"
              type="text"
              value={asistentes.email}
            />
          </FormGroup>

          <FormGroup>
            <label>CI:</label>
            <input
              className="form-control"
              readOnly
              name="ubicacion"
              type="text"
              value={asistentes.ci}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" onClick={() => setShowModalAsistente(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CrudEvents;
