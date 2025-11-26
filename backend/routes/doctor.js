const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const MedicalRecord = require('../models/MedicalRecord');
const VisitNote = require('../models/VisitNote');
const User = require('../models/User');

// @desc    Verify QR code and get patient records
// @route   POST /api/doctor/verify-qr
// @access  Private (Doctor only)
router.post('/verify-qr', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR code data is required'
      });
    }

    // Parse QR data
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code format'
      });
    }

    const { userId, timestamp, expiresIn } = parsedData;

    // Check if QR code is expired (30 minutes)
    const expiryTime = timestamp + expiresIn;
    if (Date.now() > expiryTime) {
      return res.status(401).json({
        success: false,
        message: 'QR code has expired. Please ask patient to generate a new one.'
      });
    }

    // Get patient details
    const patient = await User.findById(userId).select('-password');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get patient's medical records
    const records = await MedicalRecord.find({ userId })
      .sort({ uploadDate: -1 });

    // Get previous visit notes by this doctor
    const visitNotes = await VisitNote.find({ 
      patientId: userId,
      doctorId: req.user._id 
    })
    .sort({ visitDate: -1 })
    .limit(10);

    res.json({
      success: true,
      patient,
      records,
      visitNotes,
      accessGrantedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get patient records by patient ID
// @route   GET /api/doctor/patient/:patientId/records
// @access  Private (Doctor only)
router.get('/patient/:patientId/records', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Get patient details
    const patient = await User.findById(patientId).select('-password');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get patient's medical records
    const records = await MedicalRecord.find({ userId: patientId })
      .sort({ uploadDate: -1 });

    res.json({
      success: true,
      patient,
      records
    });
  } catch (error) {
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

    // Validate patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
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
      medicines,
      nextVisitDate,
      notes
    });

    // Populate doctor and patient details
    await visitNote.populate('doctorId', 'name specialization hospitalName');
    await visitNote.populate('patientId', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Visit note added successfully',
      visitNote
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all visit notes by doctor
// @route   GET /api/doctor/visit-notes
// @access  Private (Doctor only)
router.get('/visit-notes', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const visitNotes = await VisitNote.find({ doctorId: req.user._id })
      .populate('patientId', 'name phone email')
      .sort({ visitDate: -1 })
      .limit(50);

    res.json({
      success: true,
      count: visitNotes.length,
      visitNotes
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get visit notes for specific patient
// @route   GET /api/doctor/patient/:patientId/visit-notes
// @access  Private (Doctor only)
router.get('/patient/:patientId/visit-notes', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const visitNotes = await VisitNote.find({ 
      patientId,
      doctorId: req.user._id 
    })
    .sort({ visitDate: -1 });

    res.json({
      success: true,
      count: visitNotes.length,
      visitNotes
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update visit note
// @route   PUT /api/doctor/visit-note/:id
// @access  Private (Doctor only)
router.put('/visit-note/:id', protect, authorize('doctor'), async (req, res, next) => {
  try {
    let visitNote = await VisitNote.findOne({
      _id: req.params.id,
      doctorId: req.user._id
    });

    if (!visitNote) {
      return res.status(404).json({
        success: false,
        message: 'Visit note not found'
      });
    }

    visitNote = await VisitNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Visit note updated successfully',
      visitNote
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete visit note
// @route   DELETE /api/doctor/visit-note/:id
// @access  Private (Doctor only)
router.delete('/visit-note/:id', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const visitNote = await VisitNote.findOne({
      _id: req.params.id,
      doctorId: req.user._id
    });

    if (!visitNote) {
      return res.status(404).json({
        success: false,
        message: 'Visit note not found'
      });
    }

    await visitNote.deleteOne();

    res.json({
      success: true,
      message: 'Visit note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;