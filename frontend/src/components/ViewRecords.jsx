import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Eye, Calendar, User, Building2, AlertCircle } from 'lucide-react';
import { recordsAPI } from '../utils/api';

const ViewRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await recordsAPI.getAll();
      setRecords(response.data.records || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      await recordsAPI.delete(id);
      setRecords(records.filter(record => record._id !== id));
    } catch (err) {
      alert('Failed to delete record');
    }
  };

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

  const filteredRecords = filter === 'all' 
    ? records 
    : records.filter(record => record.category === filter);

  const categories = ['all', ...new Set(records.map(r => r.category))];

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
        <p style={{ color: '#6b7280' }}>Loading records...</p>
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

  return (
    <div>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard 
          label="Total Records" 
          value={records.length} 
          color="#667eea" 
        />
        <StatCard 
          label="This Month" 
          value={records.filter(r => {
            const recordDate = new Date(r.uploadDate);
            const now = new Date();
            return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
          }).length} 
          color="#10b981" 
        />
        <StatCard 
          label="Categories" 
          value={new Set(records.map(r => r.category)).size} 
          color="#f59e0b" 
        />
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                background: filter === cat ? '#667eea' : '#f3f4f6',
                color: filter === cat ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {cat === 'all' ? 'All Records' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <FileText size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            No records found
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {filter === 'all' ? 'Upload your first medical record to get started' : `No ${filter} records found`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredRecords.map(record => (
            <RecordCard 
              key={record._id} 
              record={record} 
              onDelete={handleDelete}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="card" style={{ textAlign: 'center' }}>
    <p style={{ fontSize: '32px', fontWeight: '700', color, marginBottom: '4px' }}>
      {value}
    </p>
    <p style={{ fontSize: '14px', color: '#6b7280' }}>{label}</p>
  </div>
);

const RecordCard = ({ record, onDelete, getCategoryColor }) => (
  <div className="card" style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    transition: 'all 0.2s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'}
  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
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
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
          {record.title}
        </h3>
        
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
              <User size={14} />
              {record.doctorName}
            </span>
          )}
          
          {record.hospitalName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
              <Building2 size={14} />
              {record.hospitalName}
            </span>
          )}
          
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
            <Calendar size={14} />
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
          background: '#f3f4f6',
          color: '#667eea',
          cursor: 'pointer',
          transition: 'all 0.2s'
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
          background: '#f3f4f6',
          color: '#10b981',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        title="Download"
      >
        <Download size={18} />
      </button>
      
      <button
        onClick={() => onDelete(record._id)}
        style={{
          padding: '8px',
          border: 'none',
          borderRadius: '8px',
          background: '#fee2e2',
          color: '#ef4444',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export default ViewRecords;