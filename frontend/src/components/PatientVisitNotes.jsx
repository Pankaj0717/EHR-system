import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Pill, AlertCircle, Eye, Stethoscope, Building2 } from 'lucide-react';
import { recordsAPI } from '../utils/api';

const PatientVisitNotes = () => {
  const [visitNotes, setVisitNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchVisitNotes();
  }, []);

  const fetchVisitNotes = async () => {
    try {
      setLoading(true);
      const response = await recordsAPI.getVisitNotes();
      setVisitNotes(response.data.visitNotes || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load visit notes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #667eea',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#6b7280' }}>Loading visit notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: '#ef4444', fontWeight: '600' }}>{error}</p>
      </div>
    );
  }

  if (selectedNote) {
    return <VisitNoteDetail note={selectedNote} onClose={() => setSelectedNote(null)} />;
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
          My Visit Notes
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          View consultation notes and prescriptions from your doctors
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#667eea', marginBottom: '4px' }}>
            {visitNotes.length}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Total Visits</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
            {visitNotes.filter(note => {
              const noteDate = new Date(note.visitDate);
              const now = new Date();
              return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>This Month</p>
        </div>
      </div>

      {visitNotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <FileText size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            No visit notes yet
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Your doctor consultations and prescriptions will appear here
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {visitNotes.map(note => (
            <div
              key={note._id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedNote(note)}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    background: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Stethoscope size={24} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                      {note.diagnosis}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6b7280' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={14} />
                        Dr. {note.doctorId?.name}
                      </span>
                      {note.doctorId?.specialization && (
                        <span>• {note.doctorId.specialization}</span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(note.visitDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {note.doctorId?.hospitalName && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '13px', 
                    color: '#6b7280',
                    marginBottom: '8px',
                    marginLeft: '60px'
                  }}>
                    <Building2 size={14} />
                    {note.doctorId.hospitalName}
                  </div>
                )}

                {note.symptoms && (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', marginLeft: '60px' }}>
                    <strong>Symptoms:</strong> {note.symptoms.length > 100 ? note.symptoms.substring(0, 100) + '...' : note.symptoms}
                  </p>
                )}

                {note.medicines && note.medicines.length > 0 && (
                  <div style={{
                    padding: '8px 12px',
                    background: '#f0fdf4',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginLeft: '60px'
                  }}>
                    <Pill size={14} />
                    {note.medicines.length} medicine{note.medicines.length > 1 ? 's' : ''} prescribed
                  </div>
                )}
              </div>

              <button
                style={{
                  padding: '8px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  cursor: 'pointer'
                }}
                title="View Details"
              >
                <Eye size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VisitNoteDetail = ({ note, onClose }) => (
  <div>
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
        color: '#667eea',
        fontWeight: '500'
      }}
    >
      ← Back to Visit Notes
    </button>

    <div className="card">
      <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
          {note.diagnosis}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} />
            <strong>Doctor:</strong> Dr. {note.doctorId?.name}
            {note.doctorId?.specialization && ` (${note.doctorId.specialization})`}
          </div>
          {note.doctorId?.hospitalName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} />
              <strong>Hospital:</strong> {note.doctorId.hospitalName}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} />
            <strong>Visit Date:</strong> {new Date(note.visitDate).toLocaleString()}
          </div>
        </div>
      </div>

      {note.symptoms && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Symptoms
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{note.symptoms}</p>
        </div>
      )}

      {note.medicines && note.medicines.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            Prescribed Medicines
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {note.medicines.map((medicine, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  {index + 1}. {medicine.name}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                  <div><strong>Dosage:</strong> {medicine.dosage}</div>
                  <div><strong>Frequency:</strong> {medicine.frequency}</div>
                  <div><strong>Duration:</strong> {medicine.duration}</div>
                  {medicine.instructions && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong>Instructions:</strong> {medicine.instructions}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {note.prescription && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            General Prescription & Advice
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{note.prescription}</p>
        </div>
      )}

      {note.notes && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Additional Notes
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{note.notes}</p>
        </div>
      )}

      {note.nextVisitDate && (
        <div style={{
          padding: '12px 16px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fcd34d'
        }}>
          <strong style={{ color: '#92400e' }}>📅 Next Visit Scheduled:</strong>{' '}
          <span style={{ color: '#92400e' }}>
            {new Date(note.nextVisitDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default PatientVisitNotes;