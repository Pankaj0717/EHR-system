import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Medical Records APIs
export const recordsAPI = {
  upload: (formData) => api.post('/records/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => api.get('/records'),
  getOne: (id) => api.get(`/records/${id}`),
  delete: (id) => api.delete(`/records/${id}`),
  getVisitNotes: () => api.get('/records/visit-notes')
};

// QR Code API
export const qrAPI = {
  generate: () => api.get('/records/qr/generate')
};

// Doctor APIs
export const doctorAPI = {
  verifyQR: (qrData) => api.post('/doctor/verify-qr', { qrData }),
  getPatientRecords: (patientId) => api.get(`/doctor/patient/${patientId}/records`),
  addVisitNote: (data) => api.post('/doctor/visit-note', data),
  getVisitNotes: () => api.get('/doctor/visit-notes'),
  getPatientVisitNotes: (patientId) => api.get(`/doctor/patient/${patientId}/visit-notes`),
  updateVisitNote: (id, data) => api.put(`/doctor/visit-note/${id}`, data),
  deleteVisitNote: (id) => api.delete(`/doctor/visit-note/${id}`)
};

export default api;