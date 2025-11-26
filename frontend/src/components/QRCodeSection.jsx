import React, { useState } from 'react';
import { QrCode, Download, RefreshCw, Clock, Shield } from 'lucide-react';
import { qrAPI } from '../utils/api';

const QRCodeSection = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [error, setError] = useState('');

  const generateQR = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await qrAPI.generate();
      setQrCode(response.data.qrCode);
      setExpiresAt(response.data.expiresAt);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `health-record-qr-${Date.now()}.png`;
    link.click();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
            Share Your Records via QR Code
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Generate a secure QR code to share your medical records with doctors
          </p>
        </div>

        {/* How it works */}
        <div style={{ 
          background: '#f0f9ff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid #bfdbfe'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="#667eea" />
            How It Works
          </h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px', lineHeight: '1.8' }}>
            <li>Click "Generate QR Code" to create a secure access code</li>
            <li>Show the QR code to your doctor during consultation</li>
            <li>Doctor scans the QR code to access your medical records</li>
            <li>Access expires automatically after 30 minutes for security</li>
          </ol>
        </div>

        {/* QR Code Display */}
        {qrCode ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              padding: '32px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              marginBottom: '16px',
              display: 'inline-block'
            }}>
              <img 
                src={qrCode} 
                alt="Medical Records QR Code" 
                style={{ 
                  width: '300px', 
                  height: '300px',
                  display: 'block'
                }} 
              />
            </div>

            {expiresAt && (
              <div style={{
                padding: '12px 16px',
                background: '#fef3c7',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#92400e'
              }}>
                <Clock size={18} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  Expires at: {new Date(expiresAt).toLocaleTimeString()}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={downloadQR}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={18} />
                Download QR Code
              </button>
              
              <button
                onClick={generateQR}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={18} />
                Generate New
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <QrCode size={64} color="#d1d5db" style={{ margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
              No QR Code Generated Yet
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Generate a QR code to share your medical records with your doctor
            </p>
            
            {error && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                marginBottom: '16px',
                padding: '12px',
                background: '#fee2e2',
                borderRadius: '8px'
              }}>
                {error}
              </p>
            )}

            <button
              onClick={generateQR}
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Generating...
                </>
              ) : (
                <>
                  <QrCode size={18} />
                  Generate QR Code
                </>
              )}
            </button>
          </div>
        )}

        {/* Security Note */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.6' }}>
            <strong style={{ color: '#1f2937' }}>🔒 Security Note:</strong> QR codes expire after 30 minutes. 
            Your medical records are encrypted and only accessible through this temporary QR code. 
            Never share your QR code on social media or with untrusted individuals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeSection;