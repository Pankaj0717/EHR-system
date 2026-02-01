const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');
const VisitNote = require('../models/VisitNote');

// @desc    Verify QR code and get patient data
// @route   POST /api/doctor/verify-qr
// @access  Private (Doctor only)
router.post('/verify-qr', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const { qrData } = req.body;
    
    // Validate qrData is provided
    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }
    
    console.log('🔍 Verifying QR code...');
    
    // Parse QR data - handle both JSON string and plain ID
    let patientId;
    try {
      const parsed = JSON.parse(qrData);
      patientId = parsed.userId || parsed.id;
      console.log('Parsed patient ID from JSON:', patientId);
    } catch (err) {
      // If not JSON, assume it's just the patient ID
      patientId = qrData;
      console.log('Using raw patient ID:', patientId);
    }

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code data'
      });
    }

    // Get patient info
    const patient = await User.findById(patientId);

    if (!patient) {
      console.log('❌ Patient not found with ID:', patientId);
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (patient.role !== 'patient') {
      console.log('❌ User is not a patient, role:', patient.role);
      return res.status(400).json({
        success: false,
        message: 'Invalid patient QR code'
      });
    }

    console.log('✅ Patient found:', patient.name);

    // Get patient's medical records
    const records = await MedicalRecord.find({ userId: patientId })
      .sort({ uploadDate: -1 });

    // Get patient's visit notes
    const visitNotes = await VisitNote.find({ patientId })
      .populate('doctorId', 'name specialization hospitalName')
      .sort({ visitDate: -1 });

    console.log('✅ Found', records.length, 'records and', visitNotes.length, 'visit notes');

    res.json({
      success: true,
      data: {
        patient: {
          _id: patient._id,
          id: patient._id,
          name: patient.name,
          phone: patient.phone,
          email: patient.email,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          address: patient.address
        },
        records: records,
        visitNotes: visitNotes,
        recordCount: records.length
      }
    });

  } catch (error) {
    console.error('❌ QR Verification error:', error);
    next(error);
  }
});

// @desc    Get patient by ID (direct access)
// @route   GET /api/doctor/patient/:id
// @access  Private (Doctor only)
router.get('/patient/:id', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const patientId = req.params.id;
    
    console.log('🔍 Fetching patient by ID:', patientId);

    // Get patient info
    const patient = await User.findById(patientId);

    if (!patient) {
      console.log('❌ Patient not found');
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (patient.role !== 'patient') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID'
      });
    }

    // Get patient's medical records
    const records = await MedicalRecord.find({ userId: patientId })
      .sort({ uploadDate: -1 });

    // Get patient's visit notes
    const visitNotes = await VisitNote.find({ patientId })
      .populate('doctorId', 'name specialization hospitalName')
      .sort({ visitDate: -1 });

    console.log('✅ Found patient:', patient.name);

    res.json({
      success: true,
      data: {
        patient: {
          _id: patient._id,
          id: patient._id,
          name: patient.name,
          phone: patient.phone,
          email: patient.email,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          address: patient.address
        },
        records: records,
        visitNotes: visitNotes,
        recordCount: records.length
      }
    });

  } catch (error) {
    console.error('❌ Error fetching patient:', error);
    next(error);
  }
});

// @desc    Add visit note for patient
// @route   POST /api/doctor/visit-note
// @access  Private (Doctor only)
router.post('/visit-note', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const {
      patientId,
      diagnosis,
      symptoms,
      prescription,
      medicines,
      nextVisitDate,
      notes
    } = req.body;

    console.log('📝 Adding visit note for patient:', patientId);

    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create visit note
    const visitNote = await VisitNote.create({
      patientId,
      doctorId: req.user._id,
      diagnosis,
      symptoms,
      prescription,
      medicines: medicines || [],
      nextVisitDate,
      notes
    });

    // Populate doctor info
    await visitNote.populate('doctorId', 'name specialization hospitalName');

    console.log('✅ Visit note created successfully');

    res.status(201).json({
      success: true,
      message: 'Visit note added successfully',
      visitNote
    });

  } catch (error) {
    console.error('❌ Error adding visit note:', error);
    next(error);
  }
});

// @desc    Get doctor's own visit notes
// @route   GET /api/doctor/my-visit-notes
// @access  Private (Doctor only)
router.get('/my-visit-notes', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const visitNotes = await VisitNote.find({ doctorId: req.user._id })
      .populate('patientId', 'name phone email')
      .sort({ visitDate: -1 });

    res.json({
      success: true,
      count: visitNotes.length,
      visitNotes
    });

  } catch (error) {
    console.error('❌ Error fetching visit notes:', error);
    next(error);
  }
});

module.exports = router;