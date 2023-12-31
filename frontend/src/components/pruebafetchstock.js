// StockComponent.js
import React, { useState, useEffect } from 'react';

function StockComponent() {
  const [currentStock, setCurrentStock] = useState(null);
  const [newStock, setNewStock] = useState(0); // Estado para almacenar el nuevo stock
  const id = '2'; // Asegúrate de tener un id válido

  // Función para obtener el stock
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/obtener_stock/${id}/`);
        const data = await response.json();
        
        if (data.stock) {
          setCurrentStock(data.stock);
        } else {
          console.error('Error al obtener el stock del boleto');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Función para actualizar el stock
  const actualizarStock = async () => {
    try {
      const response = await fetch(`http://localhost:8000/actualizar_stock/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        console.log('Stock actualizado con éxito');
        setCurrentStock(newStock); // Actualiza el estado local con el nuevo stock
      } else {
        console.error('Error al actualizar el stock:', data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div>
      {currentStock !== null ? (
        <div>
          <p>El stock actual es: {currentStock}</p>
          <input 
            type="number" 
            value={newStock} 
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="Nuevo stock"
          />
          <button onClick={actualizarStock}>Actualizar Stock</button>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default StockComponent;
