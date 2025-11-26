const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Lab Report', 'Prescription', 'X-Ray', 'MRI', 'CT Scan', 'Consultation', 'Other'],
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileType: {
    type: String
  },
  cloudinaryId: {
    type: String
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  doctorName: {
    type: String,
    trim: true
  },
  hospitalName: {
    type: String,
    trim: true
  },
  recordDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
medicalRecordSchema.index({ userId: 1, uploadDate: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);