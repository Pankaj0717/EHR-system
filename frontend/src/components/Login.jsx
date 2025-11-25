import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
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
    
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    
    const result = await login(formData);
    
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
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
            color: '#667eea',
            fontSize: '14px'
          }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Heart size={48} color="#667eea" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>
            Login to access your medical records
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter 10-digit phone number"
              maxLength="10"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="error" style={{ 
              textAlign: 'center', 
              marginBottom: '16px',
              padding: '12px',
              background: '#fee2e2',
              borderRadius: '8px',
              color: '#dc2626'
            }}>
              {error}
            </p>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '24px', 
          color: '#6b7280', 
          fontSize: '14px' 
        }}>
          Don't have an account?{' '}
          <Link 
            to="/patient/register" 
            style={{ 
              color: '#667eea', 
              fontWeight: '600', 
              textDecoration: 'none' 
            }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;