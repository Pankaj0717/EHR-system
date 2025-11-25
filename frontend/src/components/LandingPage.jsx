import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, QrCode, FileText, User, Stethoscope } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{ padding: '20px 0', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={32} color="white" />
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700' }}>HealthVault</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>
          Your Medical Records,<br />Always With You
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '20px', marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>
          Securely store and share your medical history with doctors using QR codes. No more lost records or repeated tests.
        </p>

        {/* User Type Selection Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
          {/* Patient Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '40px 32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <User size={40} color="white" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#1f2937' }}>
              I'm a Patient
            </h3>
            <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
              Store your medical records securely and share them with doctors instantly
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px' }}
                onClick={() => navigate('/patient/register')}
              >
                Register as Patient
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '14px' }}
                onClick={() => navigate('/patient/login')}
              >
                Login
              </button>
            </div>
          </div>

          {/* Doctor Card */}
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '40px 32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Stethoscope size={40} color="white" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#1f2937' }}>
              I'm a Doctor
            </h3>
            <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
              Access patient records securely and provide better care with complete medical history
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn"
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
                onClick={() => navigate('/doctor/register')}
              >
                Register as Doctor
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '14px' }}
                onClick={() => navigate('/doctor/login')}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '60px 20px' }}>
        <h3 style={{ color: 'white', fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' }}>
          Why Choose HealthVault?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <FeatureCard 
            icon={<Shield size={40} />}
            title="Secure & Private"
            description="Your data is encrypted and only you control who can access it"
          />
          <FeatureCard 
            icon={<QrCode size={40} />}
            title="Easy Sharing"
            description="Generate QR codes to instantly share records with doctors"
          />
          <FeatureCard 
            icon={<FileText size={40} />}
            title="All in One Place"
            description="Store prescriptions, lab reports, and medical history together"
          />
          <FeatureCard 
            icon={<Heart size={40} />}
            title="Patient Controlled"
            description="You decide what to share and for how long"
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div style={{ 
    background: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: '16px', 
    padding: '32px', 
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  }}>
    <div style={{ color: '#667eea', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
      {title}
    </h3>
    <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>
      {description}
    </p>
  </div>
);

export default LandingPage;