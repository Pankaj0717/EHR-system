import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { recordsAPI } from '../utils/api';

const UploadRecords = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Lab Report',
    description: '',
    doctorName: '',
    hospitalName: '',
    recordDate: ''
  });
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Lab Report',
    'Prescription',
    'X-Ray',
    'MRI',
    'CT Scan',
    'Consultation',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('category', formData.category);
      uploadData.append('description', formData.description);
      uploadData.append('doctorName', formData.doctorName);
      uploadData.append('hospitalName', formData.hospitalName);
      uploadData.append('recordDate', formData.recordDate || new Date().toISOString());

      await recordsAPI.upload(uploadData);

      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        category: 'Lab Report',
        description: '',
        doctorName: '',
        hospitalName: '',
        recordDate: ''
      });
      setFile(null);
      document.getElementById('file-input').value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
          Upload Medical Record
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Upload your medical documents securely to the cloud
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* File Upload Area */}
        <div style={{
          border: '2px dashed #d1d5db',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '24px',
          background: file ? '#f0fdf4' : '#f9fafb',
          transition: 'all 0.3s'
        }}>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            style={{ display: 'none' }}
          />
          <label
            htmlFor="file-input"
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {file ? (
              <>
                <CheckCircle size={48} color="#10b981" />
                <div>
                  <p style={{ fontWeight: '600', color: '#10b981', marginBottom: '4px' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload size={48} color="#6b7280" />
                <div>
                  <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                    Click to upload or drag and drop
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </>
            )}
          </label>
        </div>

        <div className="input-group">
          <label>Document Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Blood Test Results - Jan 2024"
          />
        </div>

        <div className="input-group">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional notes about this record..."
            rows="3"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-group">
            <label>Doctor Name</label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="Dr. Smith"
            />
          </div>

          <div className="input-group">
            <label>Hospital/Clinic</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="City Hospital"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Record Date</label>
          <input
            type="date"
            name="recordDate"
            value={formData.recordDate}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fee2e2',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#dc2626'
          }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px 16px',
            background: '#d1fae5',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#059669'
          }}>
            <CheckCircle size={20} />
            Record uploaded successfully!
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Record'}
        </button>
      </form>
    </div>
  );
};

export default UploadRecords;