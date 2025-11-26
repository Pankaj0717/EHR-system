import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Upload, FileText, QrCode, User, LogOut, Menu, X } from 'lucide-react';
import UploadRecords from './UploadRecords';
import ViewRecords from './ViewRecords';
import QRCodeSection from './QRCodeSection';
import Profile from './Profile';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('records');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'records', label: 'My Records', icon: FileText },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'qrcode', label: 'QR Code', icon: QrCode },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'white'
              }}
            >
              <Menu size={24} />
            </button>
            <Heart size={32} color="white" />
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>
              HealthVault
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                {user?.name || 'Patient'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>
                Patient Dashboard
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn"
              style={{ 
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? '250px' : '0',
          background: 'white',
          minHeight: 'calc(100vh - 64px)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          position: 'fixed',
          zIndex: 10
        }}>
          <nav style={{ padding: '24px 0' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  border: 'none',
                  background: activeTab === tab.id ? '#f3f4f6' : 'transparent',
                  color: activeTab === tab.id ? '#667eea' : '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  borderLeft: activeTab === tab.id ? '4px solid #667eea' : '4px solid transparent'
                }}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{
          flex: 1,
          marginLeft: sidebarOpen ? '250px' : '0',
          padding: '32px',
          transition: 'margin-left 0.3s ease'
        }}>
          {/* Welcome Banner */}
          {activeTab === 'records' && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                Welcome back, {user?.name}! 👋
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Manage your medical records and share them securely with doctors
              </p>
            </div>
          )}

          {/* Tab Content */}
          <div>
            {activeTab === 'records' && <ViewRecords />}
            {activeTab === 'upload' && <UploadRecords />}
            {activeTab === 'qrcode' && <QRCodeSection />}
            {activeTab === 'profile' && <Profile />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;