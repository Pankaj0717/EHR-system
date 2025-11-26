import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { doctorAPI } from '../utils/api';

const AddVisitNote = ({ patient, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    prescription: '',
    notes: '',
    nextVisitDate: ''
  });

  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const visitNoteData = {
        patientId: patient._id,
        ...formData,
        medicines: medicines.filter(m => m.name.trim() !== '')
      };

      await doctorAPI.addVisitNote(visitNoteData);
      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add visit note');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          color: '#10b981',
          fontWeight: '500'
        }}
      >
        <ArrowLeft size={20} />
        Back to Patient Records
      </button>

      <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
            Add Visit Note
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Patient: <strong>{patient.name}</strong> ({patient.phone})
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Diagnosis *</label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              placeholder="e.g., Common Cold, Viral Fever"
            />
          </div>

          <div className="input-group">
            <label>Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe the symptoms..."
              rows="3"
            />
          </div>

          {/* Medicines Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Medicines
              </label>
              <button
                type="button"
                onClick={addMedicine}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#10b981',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                Add Medicine
              </button>
            </div>

            {medicines.map((medicine, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                    Medicine {index + 1}
                  </span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      style={{
                        padding: '4px',
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Medicine name *"
                    value={medicine.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    style={{
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g., 500mg)"
                    value={medicine.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    style={{
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Frequency (e.g., Twice daily)"
                    value={medicine.frequency}
                    onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                    style={{
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 5 days)"
                    value={medicine.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    style={{
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Instructions (e.g., After meals)"
                  value={medicine.instructions}
                  onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            ))}
          </div>

          <div className="input-group">
            <label>General Prescription / Advice</label>
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              placeholder="Additional prescriptions, lifestyle advice, diet recommendations..."
              rows="3"
            />
          </div>

          <div className="input-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional observations or notes..."
              rows="3"
            />
          </div>

          <div className="input-group">
            <label>Next Visit Date</label>
            <input
              type="date"
              name="nextVisitDate"
              value={formData.nextVisitDate}
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
              Visit note added successfully!
            </div>
          )}

          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white'
            }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Visit Note'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVisitNote;
