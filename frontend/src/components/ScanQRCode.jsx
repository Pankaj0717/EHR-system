import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, AlertCircle, X, Search } from 'lucide-react';
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
  const hasScannedRef = useRef(false);
  
  // Manual input state
  const [manualId, setManualId] = useState('');
  const [showManual, setShowManual] = useState(false);

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
      setError('Unable to access camera. You can still use manual patient ID entry below.');
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
    if (hasScannedRef.current || isProcessingRef.current) {
      return;
    }

    hasScannedRef.current = true;
    isProcessingRef.current = true;
    
    console.log('QR Code scanned successfully:', decodedText);

    setScanning(false);
    
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop()
        .then(() => {
          console.log('Scanner stopped successfully');
          html5QrCodeRef.current = null;
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
      console.log('Processing QR code:', decodedText);
      const response = await doctorAPI.verifyQR(decodedText);
      setPatientData(response.data.data);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to verify QR code. Please try manual entry.');
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
      setError('No camera available. Please use manual patient ID entry below.');
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
        fps: 10,
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
      setError(`Failed to start camera: ${err.message || 'Please allow camera access or use manual entry'}`);
      setScanning(false);
      html5QrCodeRef.current = null;
    }
  };

  const startScanner = () => {
    if (!selectedCamera) {
      setError('No camera available. Please use manual patient ID entry below.');
      return;
    }

    isProcessingRef.current = false;
    hasScannedRef.current = false;
    setScanning(true);
    setError('');
    setShowManual(false);
  };

  const stopScanner = async () => {
    hasScannedRef.current = true;
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
    hasScannedRef.current = false;
  };

  const handleManualSearch = async () => {
    if (!manualId.trim()) {
      setError('Please enter a patient ID');
      return;
    }

    // Process as if it was a QR code scan
    processQRCode(JSON.stringify({ userId: manualId.trim() }));
  };

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '60px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
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
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
            Access Patient Records
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Scan the patient's QR code or enter their ID manually
          </p>
        </div>

        {/* Method Switcher */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          padding: '4px',
          background: '#f3f4f6',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => {
              setShowManual(false);
              if (scanning) stopScanner();
            }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              background: !showManual ? 'white' : 'transparent',
              color: !showManual ? '#10b981' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: !showManual ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Camera size={18} />
            Scan QR Code
          </button>
          <button
            onClick={() => {
              setShowManual(true);
              if (scanning) stopScanner();
            }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              background: showManual ? 'white' : 'transparent',
              color: showManual ? '#10b981' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: showManual ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Search size={18} />
            Manual Entry
          </button>
        </div>

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
              <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{error}</p>
            </div>
          </div>
        )}

        {/* QR Scanner View */}
        {!showManual && !scanning && (
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
                ? 'No cameras detected. Please check permissions or use manual entry.' 
                : 'Click the button below to start the camera scanner'}
            </p>

            {cameras.length > 1 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Select Camera
                </label>
                <select 
                  value={selectedCamera || ''} 
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  {cameras.map(camera => (
                    <option key={camera.id} value={camera.id}>
                      {camera.label || `Camera ${camera.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={startScanner}
              disabled={cameras.length === 0}
              style={{
                background: cameras.length === 0 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: cameras.length === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Camera size={20} />
              Start Camera Scanner
            </button>
          </div>
        )}

        {/* Active Scanner View */}
        {!showManual && scanning && (
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
                  Scanner Active - Point camera at QR code
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
                Stop
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

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#fffbeb',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#92400e',
              textAlign: 'center'
            }}>
              📷 Hold the QR code steady in front of the camera. Scanner will detect automatically.
            </div>
          </div>
        )}

        {/* Manual Entry View */}
        {showManual && (
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '32px',
            background: '#f9fafb'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Search size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                Enter Patient ID
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Enter the patient's unique ID to access their records
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Patient ID
              </label>
              <input
                type="text"
                value={manualId}
                onChange={(e) => {
                  setManualId(e.target.value);
                  setError('');
                }}
                placeholder="Enter patient ID (e.g., 67890abc123def)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSearch();
                  }
                }}
              />
            </div>

            <button
              onClick={handleManualSearch}
              disabled={!manualId.trim()}
              style={{
                width: '100%',
                padding: '14px',
                background: !manualId.trim() 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: !manualId.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Search size={20} />
              Access Patient Records
            </button>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#fffbeb',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#92400e'
            }}>
              <strong>💡 How to get Patient ID:</strong> Ask the patient to open their HealthVault app, 
              go to Profile, and share their Patient ID with you.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScanQRCode;