import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const QRScanner = ({ show, handleClose }) => {
  const [scanResult, setScanResult] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const extractCodeFromText = (text) => {
    const codeMatch = text.match(/Codigo: ([^,]+)/);
    return codeMatch ? codeMatch[1] : null;
  };

  const handleResult = (result, error) => {
    if (!!result) {
      const scannedText = result?.text;
      setScanResult('Código Escaneado: ' + scannedText);

      const extractedCode = extractCodeFromText(scannedText);
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

    if (!!error) {
      console.error('Error de escaneo:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Escáner QR</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <QrReader
          delay={300}
          onResult={handleResult}
          style={{ width: '100%' }}
          constraints={{ facingMode: 'environment' }}
        />
        <div>{scanResult}</div>
        <div>{validationResult}</div>
      </Modal.Body>
    </Modal>
  );
};

export default QRScanner;
