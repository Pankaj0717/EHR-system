import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, Droplet, MapPin, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authAPI.updateProfile(formData);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        address: user.address || ''
      });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
              My Profile
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Manage your personal information
            </p>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {success && (
          <div style={{
            padding: '12px 16px',
            background: '#d1fae5',
            borderRadius: '8px',
            marginBottom: '24px',
            color: '#059669',
            fontSize: '14px'
          }}>
            ✓ Profile updated successfully!
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fee2e2',
            borderRadius: '8px',
            marginBottom: '24px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <ProfileField
              icon={<User size={20} />}
              label="Full Name"
              value={formData.name}
              name="name"
              onChange={handleChange}
              isEditing={isEditing}
              required
            />

            <ProfileField
              icon={<Phone size={20} />}
              label="Phone Number"
              value={user?.phone || ''}
              name="phone"
              disabled
              isEditing={false}
              helpText="Phone number cannot be changed"
            />

            <ProfileField
              icon={<Mail size={20} />}
              label="Email"
              type="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              isEditing={isEditing}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ProfileField
                icon={<Calendar size={20} />}
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                name="dateOfBirth"
                onChange={handleChange}
                isEditing={isEditing}
              />

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  <User size={20} />
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1f2937'
                  }}>
                    {formData.gender || 'Not specified'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                <Droplet size={20} />
                Blood Group
              </label>
              {isEditing ? (
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <div style={{
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1f2937'
                }}>
                  {formData.bloodGroup || 'Not specified'}
                </div>
              )}
            </div>

            <ProfileField
              icon={<MapPin size={20} />}
              label="Address"
              value={formData.address}
              name="address"
              onChange={handleChange}
              isEditing={isEditing}
              multiline
            />
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                disabled={loading}
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value, name, type = 'text', onChange, isEditing, disabled, required, helpText, multiline }) => (
  <div>
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
      {icon}
      {label}
      {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {isEditing && !disabled ? (
      multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows="3"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
      )
    ) : (
      <>
        <div style={{
          padding: '12px',
          background: disabled ? '#f3f4f6' : '#f9fafb',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1f2937'
        }}>
          {value || 'Not specified'}
        </div>
        {helpText && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {helpText}
          </p>
        )}
      </>
    )}
  </div>
);

export default Profile;