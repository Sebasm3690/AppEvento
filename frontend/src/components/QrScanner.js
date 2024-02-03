import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const QRScanner = ({ show, handleClose }) => {
  const [scanResult, setScanResult] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const qrReaderRef = useRef(null);

  useEffect(() => {
    const handleCamera = async () => {
      console.log('handleCamera called');
      
      if (show) {
        // The modal is opened, turn on the camera
        if (qrReaderRef.current) {
          console.log('Opening camera');
          await qrReaderRef.current.openImageDialog();
          setIsCameraOn(true);
        }
      } else {
        // The modal is closed, turn off the camera
        if (qrReaderRef.current && isCameraOn) {
          console.log('Closing camera');
          qrReaderRef.current.closeImageDialog();
          setIsCameraOn(false);
        }
      }
    };
  
    handleCamera();
  }, [show, isCameraOn]);

  const extractCodeFromText = (text) => {
    const codeMatch = text.match(/Codigo: ([^,]+)/);
    return codeMatch ? codeMatch[1] : null;
  };

  const extractDataFromText = (text) =>{
  let data = {};
      // Extraer Orden
  const orderMatch = text.match(/Orden: (\d+)/);
  data.orden = orderMatch ? orderMatch[1] : null;

  // Extraer Nombre y Email
  const nameEmailMatch = text.match(/Orden: \d+ ([\w\s]+) ([\w.]+@\w+\.\w+)/);
  if (nameEmailMatch) {
    data.nombre = nameEmailMatch[1];
    data.email = nameEmailMatch[2];
  }

  // Extraer Fecha
  const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
  data.fecha = dateMatch ? dateMatch[0] : null;

  // Extraer Cantidad
  const quantityMatch = text.match(/Cantidad: (\d+)/);
  data.cantidad = quantityMatch ? quantityMatch[1] : null;

  return data;
  }

  const handleResult = (result, error) => {
    if (!!result) {
      const scannedText = result?.text;
      setScanResult('Código Escaneado: ' + scannedText);

      const extractedCode = extractCodeFromText(scannedText);
      const extractedData = extractDataFromText(scannedText);
      setScannedData(extractedData);
      if (extractedData && Object.values(extractedData).every(value => !!value)) {
        console.log('Exito al obtener los datos')
        setValidationResult('')
      } else {
        console.error('No se pudo extraer la información del escaneo.');
        setValidationResult('Código inválido');
      }
      if (extractedCode) {
        axios.post('http://localhost:8000/validate_qr/', { code: extractedCode })
          .then(response => {
            setValidationResult('Código válido');
          })
          .catch(error => {
            console.error('Error de validación', error);
            setValidationResult('Código inválido');
          });
      } else {
        console.error('No se pudo extraer el código del escaneo.');
        setValidationResult('Código inválido');
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Escáner QR</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <QrReader
          ref={qrReaderRef}
          delay={300}
          onResult={handleResult}
          style={{ width: '100%' }}
          constraints={{ facingMode: 'environment' }}
        />
        {scannedData && Object.values(scannedData).some(value => !!value) ? (
          <div>
            <div className="mb-3">
              <div className="card text-center">
                <div className="card-header">
                  <h4>Datos del asistente:</h4>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Nombre:</strong> {scannedData.nombre}
                  </p>
                  <p>
                    <strong>Email:</strong> {scannedData.email}
                  </p>
                  <p>
                    <strong>Orden:</strong> {scannedData.orden}
                  </p>
                  <p>
                    <strong>Fecha de compra:</strong> {scannedData.fecha}
                  </p>
                  <p>
                    <strong>Cantidad de boletos:</strong> {scannedData.cantidad}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Datos no obtenidos</div>
        )}
        <div className={`mt-3 text-center ${validationResult === 'Código válido' ? 'text-success' : 'text-danger'}`}>
          {validationResult}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default QRScanner;