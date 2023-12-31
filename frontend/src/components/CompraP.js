import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompraR = () => {
    const [error, setError] = useState(null);
    const params = new URLSearchParams(window.location.search);
    const description = params.get('description').split("/")[0];
    const value = params.get('value').split("/")[0];
    const id = params.get('id').split("/")[0];
    const currentDate = new Date().toLocaleDateString();
    const navigate = useNavigate();


    const [currentStock, setCurrentStock] = useState(null);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/obtener_stock/${id}/`);
                const data = await response.json();
                setCurrentStock(data.stock);
            } catch (error) {
                console.error('Error fetching stock:', error);
            }
        };

        fetchStock();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Primera solicitud POST para crear la orden de compra
            const response1 = await fetch('http://localhost:8000/api/crear-orden/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    valor_total: value,
                }),
            });

            const data1 = await response1.json();

            const updatedStock = currentStock - parseInt(description, 10);
            const response3 = await fetch(`http://127.0.0.1:8000/actualizar_stock/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    stock: updatedStock,
                }),
            });

            const data3 = await response3.json();

            if (data3.status === 'success') {
                alert("Compra realizada correctamente! Se le enviara su entrada al correo electronico registrado");
                navigate('/asistente/')
            }

            if (data1.num_orden) {
                console.log('Orden de compra creada con éxito.');
                // Segunda solicitud POST para consumir la API ContieneCreateAPIView
                const response2 = await fetch('http://127.0.0.1:8000/api/contiene/agregar/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        id_boleto: id,
                        num_orden: data1.num_orden,
                        cantidad_total: description,
                    }),
                });

                const data2 = await response2.json();

                if (data2.status === 'success') {
                    console.log('API ContieneCreateAPIView consumida con éxito.');
                }
            } 

        } catch (error) {
            console.error('Error:', error);
            setError('Error al realizar la compra');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Resumen de la compra</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="valorTotal" className="form-label">A continuación se le muestra lo que compró</label>
                    <p>Valor total de la compra: {value} $</p>
                    <p>Cantidad de boletos comprados: {description}</p>
                    <p>Fecha de compra: {currentDate}</p>
                </div>
                <button type="submit" className="btn btn-primary">Confirmar</button>
            </form>
        </div>
    );
};

export default CompraR;

