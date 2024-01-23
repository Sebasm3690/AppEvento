import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [alreadyScanned, setAlreadyScanned] = useState(false);
  const [scanEnabled, setScanEnabled] = useState(true);

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
        // Verificar si el boleto ya ha sido escaneado
        if (alreadyScanned) {
          setValidationResult('¡Error! El boleto ya ha sido escaneado.');
          return;
        }

        axios.post('http://localhost:8000/validate_qr/', { code: extractedCode })
          .then(response => {
            if (response.data.valid) {
              setValidationResult('Código válido');
              // Marcar que el boleto ha sido escaneado
              setAlreadyScanned(true);
              // Deshabilitar el escaneo después de una validación exitosa
              setScanEnabled(false);
            } else {
              setValidationResult('Código inválido: ' + response.data.details);
            }
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
      {scanEnabled && (
        <QrReader
          delay={300}
          onResult={handleResult}
          style={{ width: '50%' }}
          constraints={{ facingMode: 'environment' }}
        />
      )}
      <div>{validationResult}</div>
      <div>{scanResult}</div>
    </div>
  );
}

export default QRScanner;
