import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, ArrowLeft } from 'lucide-react';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'doctor',
    specialization: '',
    medicalLicense: '',
    hospitalName: '',
    experience: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    
    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    
    setLoading(false);
    
    if (result.success) {
      navigate('/doctor/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#10b981' 
          }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Stethoscope size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
            Doctor Registration
          </h2>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>
            Join HealthVault to access patient records
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Dr. John Doe"
            />
          </div>

          <div className="input-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="10-digit phone number"
              maxLength="10"
            />
          </div>

          <div className="input-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="doctor@hospital.com"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                placeholder="Cardiology"
              />
            </div>

            <div className="input-group">
              <label>Experience (years) *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="5"
                min="0"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Medical License Number *</label>
            <input
              type="text"
              name="medicalLicense"
              value={formData.medicalLicense}
              onChange={handleChange}
              required
              placeholder="MED123456"
            />
          </div>

          <div className="input-group">
            <label>Hospital/Clinic Name *</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
              placeholder="City General Hospital"
            />
          </div>

          <div className="input-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="At least 6 characters"
              minLength="6"
            />
          </div>

          <div className="input-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
            />
          </div>

          {error && <p className="error" style={{ textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

          <button 
            type="submit" 
            className="btn"
            style={{ 
              width: '100%', 
              marginTop: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white'
            }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/doctor/login" style={{ color: '#10b981', fontWeight: '600', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorRegister;