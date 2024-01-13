import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MapaDirecciones = () => {
  const [find, setFind] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState(null);

  const api_key = "AIzaSyAbE7OP9YJ4aV5txxvUBIYlVNizls048-4";
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(find)}&key=${api_key}`);
      const data = response.data;

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
        setFormattedAddress(data.results[0].formatted_address);
      } else {
        console.error('No se encontraron resultados de geocodificación.');
      }
    } catch (error) {
      console.error('Error al obtener datos del servicio de geocodificación:', error);
    }
  };

  const loadGoogleMapsScript = () => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = googleMapsUrl;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // El script de Google Maps se ha cargado correctamente.
      };

      script.onerror = (error) => {
        console.error('Error al cargar el script de Google Maps:', error);
      };
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();

    if (window.google) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
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
      const script = document.querySelector('script[src="' + googleMapsUrl + '"]');
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
            <h1 style={{ textAlign: 'center' }}>Dirección de la Ubicación del Evento</h1>
            <form className="form-inline" onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="find"
                  id="find"
                  placeholder="Pais/Ciudad, Direccion"
                  value={find}
                  onChange={(e) => setFind(e.target.value)}
                />
              </div>
              <input className="btn btn-primary" type="submit" value="Buscar" />
            </form>
            <br />
            <div style={{ textAlign: 'center' }}>
              <kbd><kbd>Latitude:</kbd>{latitude}, <kbd>Longitude:</kbd>{longitude}</kbd>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div id="map" style={{ height: '400px' }}></div>
        </div>
      </div>
    </>
  );
};

export default MapaDirecciones;
