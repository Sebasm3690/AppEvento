import React, { useState, useEffect } from "react";
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

import "../styles/organizerStyles.css";

const CrudEvents = ({ organizerObj }) => {
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
  const [events, setEvents] = useState([]);
  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
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
  const [ice, setIce] = useState(0);
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
  const [showModalRecuperar, setShowModalRecuperar] = useState(false);
  const [showModalOrdenCompra, setShowModalOrdenCompra] = useState(false);
  const [showModalAsistente, setShowModalAsistente] = useState(false);
  const [showModalContiene, setShowModalContiene] = useState(false);
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
      setIce(respuestaVenta.data[0].ice);
    }
  };

  const handleEditarBoleto = () => {
    setShowModalBoleto(true);
    const boletosEvento = boletos.find((boleto) => boleto.id_evento === id); //Se muestran solo los boletos que corresponden a dicho evento
    if (boletosEvento) {
      //alert("Si se encontró");
      setIdBoleto(boletosEvento.id_boleto);
      setStock(boletosEvento.stock);
      setTipoBoleto(boletosEvento.tipoBoleto);
      setPrecio(boletosEvento.precio);
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
    const evento = events.find((event) => event.id_evento === eventId);
    if (!evento) {
      console.error("Evento no encontrado");
      return;
    }

    const boletoEvento = boletos.find(
      (boleto) => boleto.id_evento === evento.id_evento
    ); //Encontrar los boletos de dicho evento
    if (!boletoEvento) {
      console.error("Boleto no encontrado");
      return;
    }
    const ventaEvento = ventas.find(
      (venta) => venta.id_boleto === boletoEvento.id_boleto //Encontrar las ventas donde se realizaron dichos boletos
    );

    if (ventaEvento.stock_actual === boletoEvento.stock) {
      //El stock actual debe ser igual al stock para que se permita elimninar el evento logicamente
      //Solicitud para el borrado lógico
      await axios.post(
        `http://127.0.0.1:8000/borrado_logico_evento/${eventId}/`
      );
      //Acutalizar lista de eventos despues del borrado lógico
      setEvents((prevEvents) =>
        prevEvents.filter((prevEvent) => prevEvent.id_evento !== eventId)
      );
    } else {
      show_alerta(
        "No se puede borrar el evento, ya que hay clientes que compraron boletos para dicho evento",
        "warning"
      );
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

    parametrosVenta = {
      id_boleto: boletoNuevo.id_boleto,
      iva: iva,
      descuento: 0,
      ice: ice,
      stock_actual: boletoNuevo.stock,
      precio_actual: precio, //El precio le toma del boleto con impuesto
      id_organizador: id_organizador,
    };

    axios
      .post(url_venta, parametrosVenta)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        show_alerta("Boleto listo para vender", "success");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST VENTA:", error);
      });
    setShowModalBoletoIngresar(false);
    //validarBoletoImpuesto();
  };

  const validarBoletoIngresar = async () => {
    var parametrosBoleto;
    //var precioImpuesto;

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

    //precioImpuesto = calcularPrecioImpuesto(precio);

    parametrosBoleto = {
      stock: parseInt(stock),
      [apiConfig.boleto.tipo]: tipoBoleto.trim(),
      precio: precio,
      id_evento: idEventoBoleto, //El valor se toma del response.data.id_evento del "const validar" en la opción 1 al insertar el evento
    };

    // Convertir el objeto a una cadena JSON
    //const parametrosString = JSON.stringify(parametrosBoleto, null, 2);

    // Mostrar un alert con la información del objeto
    //alert(parametrosString);

    axios
      .post(url_boleto, parametrosBoleto)
      .then((response) => {
        //id_boleto_venta = response.data.id_boleto;
        console.log("Respuesta del servidor:", response.data);
        show_alerta("El boleto ha sido agregado exitosamente", "success");
        //************************ */
        //setBoletos((prevBoletos) => [...prevBoletos, parametrosString]);
        handleIngresarVenta(response.data);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST:", error);
      });
    setShowModalBoletoIngresar(false);

    // Configurar el temporizador
  };

  /*********************************/

  const validarImpuestoEditar = async () => {
    //var jsonString = JSON.stringify(preciosSI);
    //alert(jsonString);

    ventas.map((venta) =>
      axios
        .put(`http://127.0.0.1:8000/api/v1/vende/${venta.id_vende}/`, {
          id_vende: venta.id_vende,
          id_boleto: venta.id_boleto,
          iva: iva,
          descuento: venta.descuento,
          ice: ice,
          stock_actual: venta.stock_actual,
          precio_actual: venta.precio_actual,
          id_organizador: venta.id_organizador,
        })
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);
          show_alerta(
            "Los impuestos han sido agregados exitosamente",
            "success"
          );
          setShowModalImpuestosIngresar(false);
        })
        .catch((error) => {
          console.error(
            `Error del servidor para la venta ${venta.id_boleto}:`,
            error
          );
        })
    );
    setVentas({
      ...ventas,
      iva: iva,
      ice: ice,
    });
    setIva(iva);
    setIce(ice);
    validarBoletoImpuesto();
  };

  /*const calcularPrecioImpuesto = (precio) => {
    if (iva !== 0 || ice !== 0) {
      // Realizar la operación boleto = boleto + 1/100
      let precioICE = precio + (precio * ice) / 100;
      // Realizar la operación boleto = boleto * 100
      let precioIVA = (precio * iva) / 100;
      // Precio total
      let precioTotal = precioICE + precioIVA;
      return precioTotal;
    } else {
      return precio;
    }
  };*/

  const validarBoletoImpuesto = async () => {
    const preciosSI = ventas.map((venta) => venta.precio_actual); //Precios de venta
    try {
      const boletosActualizados = boletos.map(async (boleto, index) => {
        // Realizar la operación boleto = boleto + 1/100
        let precioICE = preciosSI[index] + (preciosSI[index] * ice) / 100;
        // Realizar la operación boleto = boleto * 100
        let precioIVA = (preciosSI[index] * iva) / 100;
        // Precio total
        let precioTotal = precioICE + precioIVA;

        // Realizar la solicitud HTTP con Axios
        await axios.put(
          `http://127.0.0.1:8000/api/v1/ticket/${boleto.id_boleto}/`,
          {
            id_boleto: boleto.id_boleto,
            stock: boleto.stock,
            tipoBoleto: boleto.tipoBoleto,
            precio: precioTotal, // Aquí se utiliza el nuevo valor de precio
            id_evento: boleto.id_evento,
          }
        );

        console.log(`Venta ${boleto.id_evento} actualizada con éxito.`);

        // Devolver el boleto actualizado
        return {
          ...boleto,
          precio: precioTotal,
        };
      });

      // Esperar a que todas las solicitudes HTTP se completen
      await Promise.all(boletosActualizados);

      show_alerta("Los impuestos han sido agregados exitosamente", "success");
      setShowModalImpuestosIngresar(false);
    } catch (error) {
      console.error("Error al actualizar boletos:", error);
    }
  };

  const recuperar_evento = async (id_evento) => {
    await axios.post(
      `http://127.0.0.1:8000/recuperar_evento/${id_evento}/`,
      show_alerta("El evento ha sido recuperado correctamente", "success")
    );
    setEvents((prevEvents) =>
      prevEvents.filter((prevEvent) => prevEvent.id_evento !== id_evento)
    );
  };

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
          setShowModalInsert(false);
          setShowModalBoletoIngresar(true);
        })
        .catch((error) => {
          show_alerta(
            "No pueden quedar campos vacíos, y el nombre del evento no puede repetirse",
            "warning"
          );
          console.error("Error al realizar la solicitud POST:", error);
        });
    } else {
      parametros = {
        nombre_evento: nombre.trim(),
        fecha: fecha,
        hora: hora,
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

  return (
    <>
      <Container className="meetup-item">
        <button
          className="btn btn-primary"
          onClick={() => setShowModalInsert(true)}
        >
          Agregar evento nuevo
        </button>

        {events.some((evento) => evento.eliminado === false) && (
          <button
            className="btn btn-info"
            onClick={() => setShowModalImpuestosIngresar(true)}
          >
            Agregar impuestos
          </button>
        )}

        <button
          className="btn btn-success"
          onClick={() => setShowModalRecuperar(true)}
        >
          {/*Recuperar evento*/}
          Ver histórico
        </button>

        <br></br>
        <Table className="table">
          <thead>
            <tr>
              <th>Id_evento</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Ubicacion</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Limite</th>
              {/*<th>Imágen</th>*/}
              <th>id_organizador</th>
              <th>Opciones</th>
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
                  <td>{event.id_evento}</td>
                  <td>{event.nombre_evento}</td>
                  <td>{event.fecha}</td>
                  <td>{event.hora}</td>
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
                  <td>{event.id_organizador}</td>
                  <td>
                    <button
                      onClick={() => handleEditarEvento(event.id_evento)}
                      className="btn btn-warning"
                    >
                      Editar
                    </button>{" "}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleEliminarEvento(event.id_evento)}
                    >
                      Dar de baja
                    </button>{" "}
                    <button
                      className="btn btn-info"
                      onClick={() => mostrarOrdenCompra(event.id_evento)}
                    >
                      Ver Orden de compra
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>

      {/*Ventana modal*/}

      <Modal isOpen={showModal}>
        <ModalHeader>
          <div>
            <h3>Editar Evento</h3>
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
            <label>Id:</label>
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
            <label>Ubicacion:</label>
            <input
              className="form-control"
              name="ubicacion"
              type="text"
              onChange={(e) => setUbicacion(e.target.value)}
              value={ubicacion}
            />
          </FormGroup>

          <FormGroup>
            <label>tipo:</label>
            <input
              className="form-control"
              name="tipo"
              type="text"
              onChange={(e) => setTipo(e.target.value)}
              value={tipo}
            />
          </FormGroup>

          <FormGroup>
            <label>Descripcion:</label>
            <input
              className="form-control"
              name="descripcion"
              type="text"
              onChange={(e) => setDescripcion(e.target.value)}
              value={descripcion}
            />
          </FormGroup>

          <FormGroup>
            <label>limite:</label>
            <input
              className="form-control"
              name="limite"
              type="number"
              onChange={(e) => setLimite(e.target.value)}
              value={limite}
            />
          </FormGroup>

          {/*<FormGroup>
            <label>Imágen:</label>
            <input
              className="form-control"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
      </FormGroup>*/}

          <FormGroup>
            <label>Id_organizador:</label>
            <input
              className="form-control"
              readOnly
              name="id_organizador"
              type="text"
              onChange={(e) => setIdOrganizador(e.target.value)}
              value={id_organizador}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validar(2)}>
            Siguiente
          </Button>
          <Button color="danger" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      {/*-------------Insertar Evento---------------- */}

      <Modal isOpen={showModalInsert}>
        <ModalHeader>
          <div>
            <h3>Insertar Evento</h3>
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
            <label>Ubicacion:</label>
            <input
              className="form-control"
              name="ubicacion"
              type="text"
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Descripcion:</label>
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
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>limite:</label>
            <input
              className="form-control"
              name="limite"
              type="number"
              onChange={(e) => setLimite(e.target.value)}
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
          <Button color="primary" onClick={() => validar(1)}>
            Siguiente
          </Button>
          <Button
            className="btn btn-danger"
            onClick={() => setShowModalInsert(false)}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Modal Boleto Editar-------------------*/}

      {/*Ventana modal*/}

      {/*boletos.filter(boleto).map((boleto) => boleto.id_organizador)*/}

      <Modal isOpen={showModalBoleto}>
        <ModalHeader>
          <div>
            <h3>Editar Boleto</h3>
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
            <label>Id:</label>
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
              name="hora"
              type="money"
              onChange={(e) => setPrecio(e.target.value)}
              value={precio}
            />
          </FormGroup>
          <FormGroup>
            <label>Id_evento:</label>
            <input
              className="form-control"
              name="hora"
              type="money"
              onChange={(e) => setIdEventoBoleto(e.target.value)}
              value={id}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validarBoletoEditar()}>
            Finalizar
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Modal Boleto Ingresar-------------------*/}

      {/*Ventana modal*/}

      <Modal isOpen={showModalBoletoIngresar}>
        <ModalHeader>
          <div>
            <h3>Ingresar Boleto</h3>
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
            <label>Tipo boleto</label>
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
            <label>Id_evento:</label>
            <input
              className="form-control"
              name="number"
              type="money"
              value={idEventoBoleto}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => validarBoletoIngresar()}>
            Finalizar
          </Button>
        </ModalFooter>
      </Modal>

      {/*----------------Modal Impuestos Editar-------------------*/}

      {/*Ventana modal*/}

      <Modal isOpen={showModalImpuestosIngresar}>
        <ModalHeader>
          <div>
            <h3>Ingresar Impuestos</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Iva:</label>
            <input
              className="form-control"
              name="iva"
              type="money"
              onChange={(e) => setIva(e.target.value)}
              value={iva}
            />
          </FormGroup>
          <FormGroup>
            <label>ICE:</label>
            <input
              className="form-control"
              name="ice"
              type="money"
              onChange={(e) => setIce(e.target.value)}
              value={ice}
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
            <h3>Eventos historico</h3>
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
                <th>Id_evento</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Ubicacion</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Limite</th>
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
                      <Button
                        className="btn btn-info"
                        onClick={() => mostrarOrdenCompra(event.id_evento)}
                      >
                        Ver Orden de compra
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

      <Modal isOpen={showModalOrdenCompra} size="lg" style={estiloModal}>
        <ModalHeader>
          <div>
            <h3>Ordenes de compra</h3>
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
                <th>Número de orden</th>
                <th>Fecha</th>
                <th>Valor total</th>
                <th>IVA</th>
                <th>ICE</th>
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
                  <td>{ice + "%"}</td>

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
    </>
  );
};

export default CrudEvents;
