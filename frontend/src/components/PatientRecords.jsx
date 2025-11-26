import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, Calendar, Droplet, MapPin, FileText, Download, Eye, Plus } from 'lucide-react';
import AddVisitNote from './AddVisitNote';

const PatientRecords = ({ patientData, onClose }) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const { patient, records, visitNotes } = patientData;

  if (showAddNote) {
    return (
      <AddVisitNote 
        patient={patient} 
        onClose={() => setShowAddNote(false)} 
        onSuccess={() => {
          setShowAddNote(false);
          // Optionally refresh patient data here
        }}
      />
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Lab Report': '#3b82f6',
      'Prescription': '#10b981',
      'X-Ray': '#f59e0b',
      'MRI': '#8b5cf6',
      'CT Scan': '#ec4899',
      'Consultation': '#06b6d4',
      'Other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          border: 'none',
          background: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '16px',
          color: '#10b981',
          fontWeight: '500'
        }}
      >
        <ArrowLeft size={20} />
        Back to QR Scanner
      </button>

      {/* Patient Info Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
              Patient Information
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Access granted on {new Date().toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setShowAddNote(true)}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={18} />
            Add Visit Note
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <InfoItem icon={<User size={20} />} label="Name" value={patient.name} />
          <InfoItem icon={<Phone size={20} />} label="Phone" value={patient.phone} />
          <InfoItem icon={<Mail size={20} />} label="Email" value={patient.email || 'Not provided'} />
          <InfoItem 
            icon={<Calendar size={20} />} 
            label="Date of Birth" 
            value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Not provided'} 
          />
          <InfoItem icon={<User size={20} />} label="Gender" value={patient.gender || 'Not specified'} />
          <InfoItem icon={<Droplet size={20} />} label="Blood Group" value={patient.bloodGroup || 'Not specified'} />
        </div>

        {patient.address && (
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <InfoItem icon={<MapPin size={20} />} label="Address" value={patient.address} />
          </div>
        )}
      </div>

      {/* Previous Visit Notes */}
      {visitNotes && visitNotes.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Previous Visit Notes ({visitNotes.length})
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {visitNotes.map(note => (
              <div
                key={note._id}
                style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ fontWeight: '600', color: '#1f2937' }}>{note.diagnosis}</p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    {new Date(note.visitDate).toLocaleDateString()}
                  </p>
                </div>
                {note.prescription && (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                    <strong>Prescription:</strong> {note.prescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Records */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Medical Records ({records.length})
        </h3>

        {records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <FileText size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: '14px' }}>No medical records available</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {records.map(record => (
              <div
                key={record._id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '16px',
                  background: '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    background: getCategoryColor(record.category),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={24} color="white" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                      {record.title}
                    </h4>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: getCategoryColor(record.category),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {record.category}
                      </span>

                      {record.doctorName && (
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>
                          Dr. {record.doctorName}
                        </span>
                      )}

                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(record.uploadDate).toLocaleDateString()}
                      </span>
                    </div>

                    {record.description && (
                      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                        {record.description}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => window.open(record.fileUrl, '_blank')}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#e0f2fe',
                      color: '#0284c7',
                      cursor: 'pointer'
                    }}
                    title="View"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = record.fileUrl;
                      link.download = record.title;
                      link.click();
                    }}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#d1fae5',
                      color: '#059669',
                      cursor: 'pointer'
                    }}
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#6b7280' }}>
      {icon}
      <span style={{ fontSize: '13px', fontWeight: '500' }}>{label}</span>
    </div>
    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', marginLeft: '28px' }}>
      {value}
    </p>
  </div>
);

export default PatientRecords;