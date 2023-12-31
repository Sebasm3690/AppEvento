import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter } from "reactstrap";

import { show_alerta } from "../../functions";

const Vende = () => {
  const apiUrl = "http://127.0.0.1:8000/api/v1/vende/";

  const [vendeData, setVendeData] = useState([]);
  const [formData, setFormData] = useState({
    id_boleto: "",
    id_organizador: "",
    iva: "",
    descuento: "",
    ice: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getVendeData();
  }, []);

  const getVendeData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setVendeData(response.data);
    } catch (error) {
      console.error("Error al obtener Detalles de la Venta:", error);
    }
  };

  const handleEditarVende = (vendeId) => {
    const vendeInstance = vendeData.find((vende) => vende.id_boleto === vendeId);
    if (vendeInstance) {
      setFormData({
        id_boleto: vendeInstance.id_boleto,
        id_organizador: vendeInstance.id_organizador,
        iva: vendeInstance.iva,
        descuento: vendeInstance.descuento,
        ice: vendeInstance.ice,
      });
      setShowModal(true);
    }
  };

  const validar = async () => {
    try {
      if (formData.id_boleto) {
        // Si id_boleto existe en formData, realizamos una actualización (PUT)
        const updateUrl = `${apiUrl}${formData.id_boleto}/`;
        const response = await axios.put(updateUrl, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Respuesta del servidor:", response.data);
        show_alerta("Datos de Vende actualizados exitosamente", "success");
      } else {
        // Si id_boleto no existe, realizamos una creación (POST)
        const response = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Respuesta del servidor:", response.data);
        alert("Nueva Instancia Detalle de Ventas Creada exitosamente");
      }

      setFormData({
        id_boleto: "",
        id_organizador: "",
        iva: "",
        descuento: "",
        ice: "",
      });
      setShowModal(false);
      getVendeData();
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert("Error al guardar los datos de Vende");
    }
  };

  return (
    <>
      <Container>
        <Table className="table">
          <thead>
            <tr>
              <th>Id_Boleto</th>
              <th>Id_Organizador</th>
              <th>IVA</th>
              <th>DESCUENTO</th>
              <th>ICE</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendeData.map((vende) => (
              <tr key={vende.id_boleto}>
                <td>{vende.id_boleto}</td>
                <td>{vende.id_organizador}</td>
                <td>{vende.iva}</td>
                <td>{vende.descuento}</td>
                <td>{vende.ice}</td>
                <td>
                  <Button color="warning" onClick={() => handleEditarVende(vende.id_boleto)}>
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal isOpen={showModal}>
        <ModalHeader>
          <div>
            <h3>Editar Detalles de Venta</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>Id Boleto:</label>
            <input className="form-control" readOnly type="text" name="id_boleto" value={formData.id_boleto} />
          </FormGroup>

          <FormGroup>
            <label>Id Organizador:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id_organizador"
              value={formData.id_organizador}
            />
          </FormGroup>

          <FormGroup>
            <label>Iva:</label>
            <input
              className="form-control"
              name="iva"
              type="text"
              value={formData.iva}
              onChange={(e) => setFormData({ ...formData, iva: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>Descuento:</label>
            <input
              className="form-control"
              name="descuento"
              type="text"
              value={formData.descuento}
              onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>Ice:</label>
            <input
              className="form-control"
              name="ice"
              type="text"
              value={formData.ice}
              onChange={(e) => setFormData({ ...formData, ice: e.target.value })}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={validar}>
            Guardar
          </Button>
          <Button color="danger" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Vende;
