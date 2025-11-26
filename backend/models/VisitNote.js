const mongoose = require('mongoose');

const visitNoteSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
    trim: true
  },
  symptoms: {
    type: String,
    trim: true
  },
  prescription: {
    type: String,
    trim: true
  },
  medicines: [{
    name: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: {
      type: String
    }
  }],
  nextVisitDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  visitDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
visitNoteSchema.index({ patientId: 1, visitDate: -1 });
visitNoteSchema.index({ doctorId: 1, visitDate: -1 });

module.exports = mongoose.model('VisitNote', visitNoteSchema);