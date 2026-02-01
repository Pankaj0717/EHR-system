import React, { useState } from 'react';
import { ArrowLeft, FileText, User, Phone, Mail, Calendar, Droplet, Sparkles, Download, Eye } from 'lucide-react';
import AddVisitNote from './AddVisitNote';

const PatientRecords = ({ patientData, onClose }) => {
  const [activeTab, setActiveTab] = useState('records');
  const [showAddNote, setShowAddNote] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { patient, records, visitNotes } = patientData;

  const getCategoryColor = (category) => {
    const colors = {
      'Lab Report': '#3b82f6',
      'Prescription': '#10b981',
      'X-Ray': '#8b5cf6',
      'MRI': '#f59e0b',
      'CT Scan': '#ef4444',
      'Consultation': '#06b6d4',
      'Other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '24px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={18} />
            Back to Scanner
          </button>

          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 16px 0' }}>
            Patient: {patient.name}
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            padding: '16px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px'
          }}>
            {patient.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} />
                <span style={{ fontSize: '14px' }}>{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} />
                <span style={{ fontSize: '14px' }}>{patient.email}</span>
              </div>
            )}
            {patient.bloodGroup && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplet size={16} />
                <span style={{ fontSize: '14px' }}>Blood Group: {patient.bloodGroup}</span>
              </div>
            )}
            {patient.dateOfBirth && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} />
                <span style={{ fontSize: '14px' }}>
                  DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 24px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
            onClick={() => setActiveTab('records')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              color: activeTab === 'records' ? '#10b981' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'records' ? '3px solid #10b981' : 'none',
              marginBottom: '-2px',
              fontSize: '16px'
            }}
          >
            Medical Records ({records?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              color: activeTab === 'visits' ? '#10b981' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'visits' ? '3px solid #10b981' : 'none',
              marginBottom: '-2px',
              fontSize: '16px'
            }}
          >
            Visit History ({visitNotes?.length || 0})
          </button>
        </div>

        {/* Medical Records Tab */}
        {activeTab === 'records' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                Medical Records
              </h2>
              <button
                onClick={() => setShowAddNote(true)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Add Visit Note
              </button>
            </div>

            {records && records.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {records.map(record => (
                  <div
                    key={record._id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: `${getCategoryColor(record.category)}15`,
                            color: getCategoryColor(record.category)
                          }}>
                            {record.category}
                          </span>
                          {record.aiProcessed && (
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: '#f0fdf4',
                              color: '#16a34a'
                            }}>
                              <Sparkles size={12} />
                              AI Analyzed
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                          {record.title}
                        </h3>

                        {record.description && (
                          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                            {record.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                          {record.doctorName && <span>👨‍⚕️ {record.doctorName}</span>}
                          {record.hospitalName && <span>🏥 {record.hospitalName}</span>}
                          <span>📅 {new Date(record.uploadDate).toLocaleDateString()}</span>
                        </div>

                        {record.aiSummary && record.aiSummary.simpleSummary && (
                          <div style={{
                            padding: '12px',
                            background: '#f0fdf4',
                            borderRadius: '8px',
                            borderLeft: '3px solid #10b981'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                              <Sparkles size={14} color="#10b981" />
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#059669' }}>
                                AI Summary
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#065f46', margin: 0, lineHeight: '1.5' }}>
                              {record.aiSummary.simpleSummary}
                            </p>
                          </div>
                        )}
                      </div>

                      <a
                        href={record.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 16px',
                          background: '#f3f4f6',
                          color: '#374151',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={16} />
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '60px 20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <FileText size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280' }}>
                  No medical records found
                </h3>
              </div>
            )}
          </div>
        )}

        {/* Visit History Tab */}
        {activeTab === 'visits' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              Visit History
            </h2>

            {visitNotes && visitNotes.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {visitNotes.map(note => (
                  <div
                    key={note._id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                          {note.doctorId?.name || 'Doctor'}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                          {note.doctorId?.specialization || 'Specialist'}
                        </p>
                      </div>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        {new Date(note.visitDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      {note.diagnosis && (
                        <InfoRow label="Diagnosis" value={note.diagnosis} />
                      )}
                      {note.symptoms && (
                        <InfoRow label="Symptoms" value={note.symptoms} />
                      )}
                      {note.prescription && (
                        <InfoRow label="Prescription" value={note.prescription} />
                      )}
                      {note.notes && (
                        <InfoRow label="Notes" value={note.notes} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '60px 20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Calendar size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280' }}>
                  No visit history found
                </h3>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Visit Note Modal */}
      {showAddNote && (
        <AddVisitNote
          patient={patient}
          onClose={() => setShowAddNote(false)}
          onSuccess={() => {
            setShowAddNote(false);
            // Optionally refresh data here
          }}
        />
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
        {label}:
      </span>
      <span style={{ color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>
        {value}
      </span>
    </div>
  );
};

export default PatientRecords;