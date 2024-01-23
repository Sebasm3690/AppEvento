import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
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
        // Aquí puedes agregar la lógica para enviar el resultado al backend
        axios.post('http://localhost:8000/validate_qr/', { code: extractedCode })
          .then(response => {
            // Manejo de la respuesta de validación
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
    <div>
      <QrReader
        delay={300}
        onResult={handleResult}
        style={{ width: '100%' }}
        constraints={{ facingMode: 'environment' }} // Para cámaras traseras en dispositivos móviles
      />
      <div>{scanResult}</div>
      <div>{validationResult}</div>
    </div>
  );
}

export default QRScanner;
