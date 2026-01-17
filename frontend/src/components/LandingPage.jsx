import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, QrCode, FileText, User, Stethoscope, Zap, ArrowRight, Activity, Database } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#1E293B' }}>
      
      {/* --- SLIM NAVIGATION --- */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', borderBottom: '1px solid #EDF2F7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#10B981', padding: '6px', borderRadius: '8px' }}>
            <Heart size={20} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '22px', color: '#0F172A', letterSpacing: '-0.5px' }}>HealthVault</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '500', cursor: 'pointer' }}></span>
          <button onClick={() => navigate('/login')} style={{ background: '#0F172A', color: 'white', padding: '8px 20px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Sign In</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header style={{ padding: '80px 40px 40px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={promoBadge}><Zap size={14} /> Powered by AI Analysis</div>
        <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#0F172A', lineHeight: '1.1', marginBottom: '20px' }}>
          Decentralized Medical <span style={{ color: '#10B981' }}>Intelligence.</span>
        </h1>
        <p style={{ fontSize: '19px', color: '#64748B', maxWidth: '700px', margin: '0 auto 50px', lineHeight: '1.6' }}>
          A secure bridge between patients and healthcare providers. Store your records in the cloud, analyze them with AI, and share instantly via encrypted QR.
        </p>

        {/* --- DUAL LOGIN CARDS (The Main Focus) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          
          {/* Patient Card */}
          <div style={loginCard}>
            <div style={{ ...iconHeader, background: '#ECFDF5' }}><User size={32} color="#10B981" /></div>
            <h2 style={cardTitle}>Patient Portal</h2>
            <p style={cardDesc}>Securely manage your personal medical records, view doctor notes, and generate sharing codes.</p>
            <div style={featureList}>
              <div style={checkItem}><Shield size={16} color="#10B981"/> Cloudinary Secure Storage</div>
              <div style={checkItem}><Shield size={16} color="#10B981"/> AI Prescription Summary</div>
            </div>
            <button onClick={() => navigate('/patient/register')} style={patientBtn}>
              Enter Patient Dashboard <ArrowRight size={18} />
            </button>
          </div>

          {/* Doctor Card */}
          <div style={loginCard}>
            <div style={{ ...iconHeader, background: '#F1F5F9' }}><Stethoscope size={32} color="#475569" /></div>
            <h2 style={cardTitle}>Doctor Portal</h2>
            <p style={cardDesc}>Scan patient QR codes to access medical history and add digital prescriptions or visit notes.</p>
            <div style={featureList}>
              <div style={checkItem}><Shield size={16} color="#475569"/> Instant QR Scanning</div>
              <div style={checkItem}><Shield size={16} color="#475569"/> Digital Note Syncing</div>
            </div>
            <button onClick={() => navigate('/doctor/register')} style={doctorBtn}>
              Enter Doctor Portal <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </header>

      {/* --- BOTTOM FEATURE STRIP --- */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #EDF2F7', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          <div style={miniFeature}>
            <Activity color="#10B981" />
            <h4 style={miniTitle}>Live Sync</h4>
            <p style={miniText}>Notes added by doctors appear instantly on the patient's mobile dashboard.</p>
          </div>
          <div style={miniFeature}>
            <Database color="#10B981" />
            <h4 style={miniTitle}>Cloud Secure</h4>
            <p style={miniText}>End-to-end encrypted storage for all medical PDFs and image reports.</p>
          </div>
          <div style={miniFeature}>
            <QrCode color="#10B981" />
            <h4 style={miniTitle}>Quick Connect</h4>
            <p style={miniText}>Zero-contact medical history sharing using auto-generated QR technology.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- STYLES ---
const promoBadge = { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DCFCE7', color: '#166534', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' };

const loginCard = {
  background: '#FFFFFF', padding: '48px', borderRadius: '24px', textAlign: 'left',
  border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
  display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease'
};

const iconHeader = { width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' };
const cardTitle = { fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: '#0F172A' };
const cardDesc = { fontSize: '15px', color: '#64748B', lineHeight: '1.6', marginBottom: '24px', height: '45px' };
const featureList = { marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' };
const checkItem = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#334155' };

const patientBtn = { 
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  width: '100%', padding: '16px', background: '#10B981', color: 'white', 
  border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' 
};

const doctorBtn = { 
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  width: '100%', padding: '16px', background: '#0F172A', color: 'white', 
  border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' 
};

const miniFeature = { textAlign: 'left' };
const miniTitle = { fontSize: '17px', fontWeight: '700', margin: '12px 0 8px', color: '#0F172A' };
const miniText = { fontSize: '14px', color: '#64748B', lineHeight: '1.5' };

export default LandingPage;