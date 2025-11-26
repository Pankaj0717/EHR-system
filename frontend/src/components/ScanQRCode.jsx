import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, AlertCircle, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { doctorAPI } from '../utils/api';
import PatientRecords from './PatientRecords';

const ScanQRCode = () => {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientData, setPatientData] = useState(null);
  const html5QrCodeRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const isProcessingRef = useRef(false);
  const hasScannedRef = useRef(false); // Track if we've already scanned

  useEffect(() => {
    getCameras();
    return () => {
      cleanupScanner();
    };
  }, []);

  useEffect(() => {
    if (scanning && !hasScannedRef.current) {
      setTimeout(() => {
        initializeScanner();
      }, 100);
    }
  }, [scanning]);

  const getCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      console.log('Available cameras:', devices);
      setCameras(devices);
      if (devices && devices.length > 0) {
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        setSelectedCamera(backCamera?.id || devices[0].id);
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const cleanupScanner = () => {
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.stop().catch(console.error);
      } catch (err) {
        console.error('Cleanup error:', err);
      }
      html5QrCodeRef.current = null;
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    // Prevent multiple scans
    if (hasScannedRef.current || isProcessingRef.current) {
      return;
    }

    hasScannedRef.current = true;
    isProcessingRef.current = true;
    
    console.log('QR Code scanned successfully:', decodedText);

    // IMMEDIATELY stop the scanner synchronously
    setScanning(false);
    
    // Stop scanner immediately
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop()
        .then(() => {
          console.log('Scanner stopped successfully');
          html5QrCodeRef.current = null;
          // Now process the QR code
          processQRCode(decodedText);
        })
        .catch(err => {
          console.error('Error stopping scanner:', err);
          html5QrCodeRef.current = null;
          processQRCode(decodedText);
        });
    } else {
      processQRCode(decodedText);
    }
  };

  const processQRCode = async (decodedText) => {
    setLoading(true);
    setError('');

    try {
      const response = await doctorAPI.verifyQR(decodedText);
      setPatientData(response.data);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify QR code');
      setPatientData(null);
      hasScannedRef.current = false;
    } finally {
      setLoading(false);
      isProcessingRef.current = false;
    }
  };

  const onScanError = (errorMessage) => {
    // Ignore common scanning errors
    if (!errorMessage.includes('NotFoundException') && 
        !errorMessage.includes('No MultiFormat Readers')) {
      // console.warn('Scan error:', errorMessage);
    }
  };

  const initializeScanner = async () => {
    if (!selectedCamera) {
      setError('No camera available. Please check camera permissions.');
      setScanning(false);
      return;
    }

    const element = document.getElementById('qr-reader');
    if (!element) {
      console.error('qr-reader element not found');
      setError('Scanner initialization failed. Please try again.');
      setScanning(false);
      return;
    }

    try {
      console.log('Initializing scanner...');
      const qrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = qrCode;

      const config = {
        fps: 5, // Reduced FPS to slow down scanning
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await qrCode.start(
        selectedCamera,
        config,
        onScanSuccess,
        onScanError
      );

      console.log('Scanner started successfully');
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError(`Failed to start scanner: ${err.message || 'Please allow camera access'}`);
      setScanning(false);
      html5QrCodeRef.current = null;
    }
  };

  const startScanner = () => {
    if (!selectedCamera) {
      setError('No camera available. Please check camera permissions.');
      return;
    }

    isProcessingRef.current = false;
    hasScannedRef.current = false; // Reset scan flag
    setScanning(true);
    setError('');
  };

  const stopScanner = async () => {
    hasScannedRef.current = true; // Prevent any pending scans
    setScanning(false);
    
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        console.log('Scanner stopped manually');
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      html5QrCodeRef.current = null;
    }
  };

  const handleClearPatient = () => {
    setPatientData(null);
    setError('');
    isProcessingRef.current = false;
    hasScannedRef.current = false; // Allow scanning again
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #10b981',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 24px'
        }}></div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
          Verifying QR Code...
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Please wait while we fetch patient records
        </p>
      </div>
    );
  }

  if (patientData) {
    return <PatientRecords patientData={patientData} onClose={handleClearPatient} />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
            Scan Patient QR Code
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Ask the patient to show their QR code from the HealthVault app
          </p>
        </div>

        <div style={{
          background: '#f0fdf4',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid #bbf7d0'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="#10b981" />
            How to Access Patient Records
          </h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px', lineHeight: '1.8' }}>
            <li>Click "Start Camera Scanner" button below</li>
            <li>Allow camera access when prompted by your browser</li>
            <li>Ask patient to open their HealthVault app and generate QR code</li>
            <li>Point your camera at the patient's QR code</li>
            <li>Hold steady - scanner will detect and stop automatically</li>
          </ol>
        </div>

        {cameras.length > 1 && !scanning && (
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>Select Camera</label>
            <select 
              value={selectedCamera || ''} 
              onChange={(e) => setSelectedCamera(e.target.value)}
              style={{ width: '100%' }}
            >
              {cameras.map(camera => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Camera ${camera.id}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fee2e2',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#dc2626'
          }}>
            <AlertCircle size={20} />
            <div>
              <p style={{ margin: 0, fontWeight: '600' }}>{error}</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                Make sure you've allowed camera access in your browser settings.
              </p>
            </div>
          </div>
        )}

        {!scanning ? (
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            background: '#f9fafb'
          }}>
            <QrCode size={64} color="#10b981" style={{ margin: '0 auto 24px' }} />
            
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
              Ready to Scan
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              {cameras.length === 0 
                ? 'No cameras detected. Please check camera permissions.' 
                : 'Click the button below to start the camera scanner'}
            </p>

            <button
              onClick={startScanner}
              className="btn"
              disabled={cameras.length === 0}
              style={{
                background: cameras.length === 0 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                fontSize: '16px',
                cursor: cameras.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <Camera size={20} />
              Start Camera Scanner
            </button>
          </div>
        ) : (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px',
              padding: '12px 16px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>
                  Scanner Active - Hold steady and point at QR code
                </span>
              </div>
              <button
                onClick={stopScanner}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <X size={16} />
                Stop Scanner
              </button>
            </div>

            <div 
              id="qr-reader"
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #10b981',
                minHeight: '300px',
                background: '#000'
              }}
            ></div>
          </div>
        )}

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#fffbeb',
          borderRadius: '8px',
          border: '1px solid #fcd34d'
        }}>
          <p style={{ fontSize: '13px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
            <strong>📷 Camera Permission Required:</strong> Your browser will ask for camera access. 
            Please click "Allow" to enable QR code scanning. The scanner will automatically stop after detecting a valid QR code.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ScanQRCode;