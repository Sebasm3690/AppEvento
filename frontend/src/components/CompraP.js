import React, { useState } from 'react';

const CompraR = () => {
    const [error, setError] = useState('');
    const params = new URLSearchParams(window.location.search);
    const description = params.get('description');
    const value = params.get('value');
    const id = params.get('id').split("/")[0];
    const currentDate = new Date().toLocaleDateString();

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

            if (data1.num_orden) {
                console.log('Orden de compra creada con éxito.');
                alert(id);
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
            } else {
                throw new Error('Error al crear la orden de compra');
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

