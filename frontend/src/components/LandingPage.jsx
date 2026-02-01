import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, QrCode, Sparkles, ArrowRight, FileText, Stethoscope } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <header style={{ padding: '80px 20px', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
            <Heart size={64} />
            <h1 style={{ fontSize: '56px', fontWeight: '700', margin: 0 }}>
              HealthVault
            </h1>
          </div>
          <p style={{ fontSize: '24px', marginBottom: '40px', opacity: 0.95 }}>
            Your Digital Medical Records, Always With You
          </p>
          <p style={{ fontSize: '18px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', opacity: 0.9 }}>
            Store, manage, and share your medical records securely with QR code technology and AI-powered insights
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Get Started as Patient
              <ArrowRight size={20} />
            </button>
            
            <button
              onClick={() => navigate('/doctor/register')}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Stethoscope size={20} />
              I'm a Doctor
            </button>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                textDecoration: 'underline',
                opacity: 0.9
              }}
            >
              Patient Login
            </button>
            <span style={{ color: 'white', opacity: 0.5 }}>|</span>
            <button
              onClick={() => navigate('/doctor/login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                textDecoration: 'underline',
                opacity: 0.9
              }}
            >
              Doctor Login
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#1f2937' }}>
            Why Choose HealthVault?
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <FeatureCard
              icon={<Shield size={48} color="#667eea" />}
              title="Secure & Private"
              description="Your medical data is encrypted and never shared without your permission. Complete control over your health information."
            />
            
            <FeatureCard
              icon={<QrCode size={48} color="#667eea" />}
              title="Easy QR Sharing"
              description="Generate a QR code to instantly share your records with doctors. Simple, fast, and paperless."
            />
            
            <FeatureCard
              icon={<Sparkles size={48} color="#667eea" />}
              title="AI-Powered Insights"
              description="AI analyzes your medical reports and explains them in simple, easy-to-understand language."
            />
            
            <FeatureCard
              icon={<FileText size={48} color="#667eea" />}
              title="All-in-One Storage"
              description="Store prescriptions, lab reports, X-rays, visit notes, and complete medical history in one place."
            />
            
            <FeatureCard
              icon={<Heart size={48} color="#667eea" />}
              title="Patient Controlled"
              description="You choose what to share and how long doctors can view it. Your health, your choice."
            />
            
            <FeatureCard
              icon={<Stethoscope size={48} color="#667eea" />}
              title="Doctor Friendly"
              description="Doctors get instant access to complete medical history, enabling better care and faster decisions."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '24px' }}>
            Ready to Take Control of Your Health?
          </h2>
          <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>
            Join thousands of patients and doctors using HealthVault for better healthcare management
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '18px 40px',
              fontSize: '20px',
              fontWeight: '600',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 20px', background: '#1f2937', color: 'white', textAlign: 'center' }}>
        <p style={{ margin: 0, opacity: 0.8 }}>
          © 2026 HealthVault. Your medical records, always with you.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div style={{
      padding: '32px',
      background: '#f9fafb',
      borderRadius: '16px',
      textAlign: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ marginBottom: '16px' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
        {title}
      </h3>
      <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
        {description}
      </p>
    </div>
  );
};

export default LandingPage;