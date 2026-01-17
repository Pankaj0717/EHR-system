import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Eye, Calendar, User, Building2, Sparkles, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ViewRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/records', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRecords(response.data.records || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch records');
      setLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/records/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRecords(records.filter(r => r._id !== recordId));
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Loader size={48} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading your records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <AlertCircle size={48} color="#ef4444" />
        <p style={{ marginTop: '16px', color: '#ef4444' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
          Your Medical Records
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          {records.length} {records.length === 1 ? 'record' : 'records'} stored securely
        </p>
      </div>

      {records.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '60px 20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <FileText size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            No records yet
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Upload your first medical record to get started
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {records.map(record => (
            <RecordCard
              key={record._id}
              record={record}
              onView={handleViewDetails}
              onDelete={handleDelete}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      )}

      {showModal && selectedRecord && (
        <RecordModal
          record={selectedRecord}
          onClose={() => setShowModal(false)}
          getCategoryColor={getCategoryColor}
        />
      )}
    </div>
  );
};

const RecordCard = ({ record, onView, onDelete, getCategoryColor }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: '1px solid #f3f4f6',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{
              display: 'inline-block',
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
                display: 'inline-flex',
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

          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            {record.title}
          </h3>

          {record.description && (
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              marginBottom: '12px'
            }}>
              {record.description}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
            {record.doctorName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} />
                {record.doctorName}
              </div>
            )}
            {record.hospitalName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={14} />
                {record.hospitalName}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} />
              {new Date(record.recordDate).toLocaleDateString()}
            </div>
          </div>

          {/* AI Summary Preview */}
          {record.aiSummary && record.aiSummary.simpleSummary && (
            <div style={{
              marginTop: '12px',
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
              <p style={{
                fontSize: '13px',
                color: '#065f46',
                lineHeight: '1.5',
                margin: 0
              }}>
                {record.aiSummary.simpleSummary.substring(0, 150)}
                {record.aiSummary.simpleSummary.length > 150 ? '...' : ''}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          <button
            onClick={() => onView(record)}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: '#f3f4f6',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
            title="View Details"
          >
            <Eye size={18} />
          </button>

          <a
            href={record.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: '#f3f4f6',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
            title="Download"
          >
            <Download size={18} />
          </a>

          <button
            onClick={() => onDelete(record._id)}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: '#fee2e2',
              color: '#dc2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#fecaca'}
            onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const RecordModal = ({ record, onClose, getCategoryColor }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '32px'
      }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            background: `${getCategoryColor(record.category)}15`,
            color: getCategoryColor(record.category),
            marginBottom: '12px'
          }}>
            {record.category}
          </span>
          
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
            {record.title}
          </h2>

          {record.description && (
            <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '16px' }}>
              {record.description}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '14px', color: '#6b7280' }}>
            {record.doctorName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} />
                <span><strong>Doctor:</strong> {record.doctorName}</span>
              </div>
            )}
            {record.hospitalName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={16} />
                <span><strong>Hospital:</strong> {record.hospitalName}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} />
              <span><strong>Date:</strong> {new Date(record.recordDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        {record.aiProcessed && record.aiSummary && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            border: '2px solid #10b981'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={20} color="#10b981" />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#059669', margin: 0 }}>
                AI Analysis
              </h3>
            </div>

            {record.aiSummary.simpleSummary && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>
                  Summary
                </h4>
                <p style={{ color: '#047857', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {record.aiSummary.simpleSummary}
                </p>
              </div>
            )}

            {record.aiSummary.keyFindings && record.aiSummary.keyFindings.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>
                  Key Findings
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#047857', fontSize: '14px' }}>
                  {record.aiSummary.keyFindings.map((finding, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}

            {record.aiSummary.medications && record.aiSummary.medications.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>
                  💊 Medications
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#047857', fontSize: '14px' }}>
                  {record.aiSummary.medications.map((med, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{med}</li>
                  ))}
                </ul>
              </div>
            )}

            {record.aiSummary.instructions && record.aiSummary.instructions.length > 0 && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>
                  ⚠️ Important Instructions
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#047857', fontSize: '14px' }}>
                  {record.aiSummary.instructions.map((instruction, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!record.aiProcessed && (
          <div style={{
            background: '#fef3c7',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Loader size={16} color="#f59e0b" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '13px', color: '#92400e' }}>
              AI analysis in progress...
            </span>
          </div>
        )}

        {/* Original Document */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
            Original Document
          </h3>
          
          <a
            href={record.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Download size={18} />
            View/Download Document
          </a>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '24px',
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            background: 'white',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
          onMouseLeave={(e) => e.target.style.background = 'white'}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Add keyframe animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default ViewRecords;