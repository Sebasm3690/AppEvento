import React, { useState, useEffect } from "react";
import { Button, Container, FormGroup } from "reactstrap";
import axios from "axios";

import { show_alerta } from "../../functions";

const TuComponente = () => {
    const [imagen, setImagen] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const storedImageUrl = localStorage.getItem('imagenUrl');
        if (storedImageUrl) {
            setImageUrl(storedImageUrl);
        }
    }, []);

    const handleImageChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const isValidImage = (file) => {
        if (!file) {
            return false;
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(file.type);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!isValidImage(imagen)) {
            show_alerta("Por favor, seleccione una imagen PNG o JPG.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append('imagen', imagen);

        try {
            const response = await axios.patch('http://127.0.0.1:8000/api/api/v1/event/2/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Respuesta del servidor:', response.data);
            show_alerta("Imagen Enviada Exitosamente", "success");
            localStorage.setItem('imagenUrl', response.data.imagen);
            setImageUrl(response.data.imagen);

        } catch (error) {
            console.error('Error al enviar la imagen:', error);
        }
    };

    return (
        <Container>
            <FormGroup>
                <label>Imagen:</label>
                <input type="file" onChange={handleImageChange} />
            </FormGroup>
            <Button onClick={handleFormSubmit}>Guardar</Button>
            {imageUrl && (
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <img src={imageUrl} alt="Imagen Cargada" style={{ maxWidth: "700px" }} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </Container>
    );
};

export default TuComponente;
