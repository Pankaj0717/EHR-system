const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); // Import from config
const MedicalRecord = require('../models/MedicalRecord');
const QRCode = require('qrcode');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs only
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  }
});

// @desc    Upload medical record
// @route   POST /api/records/upload
// @access  Private
router.post('/upload', protect, upload.single('file'), async (req, res, next) => {
  try {
    console.log('📤 Upload request received');
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('☁️ Uploading to Cloudinary...');
    
    // Upload to Cloudinary using buffer
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'medical-records',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload success');
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    console.log('💾 Saving to database...');
    
    // Create record in database
    const record = await MedicalRecord.create({
      userId: req.user._id,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      cloudinaryId: result.public_id,
      doctorName: req.body.doctorName,
      hospitalName: req.body.hospitalName,
      recordDate: req.body.recordDate || Date.now()
    });

    console.log('✅ Record saved successfully');

    res.status(201).json({
      success: true,
      message: 'Record uploaded successfully',
      record
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    next(error);
  }
});

// @desc    Get all records for user
// @route   GET /api/records
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const records = await MedicalRecord.find({ userId: req.user._id })
      .sort({ uploadDate: -1 });

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single record
// @route   GET /api/records/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete record
// @route   DELETE /api/records/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Delete from Cloudinary
    if (record.cloudinaryId) {
      await cloudinary.uploader.destroy(record.cloudinaryId);
    }

    await record.deleteOne();

    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Generate QR code
// @route   GET /api/records/qr/generate
// @access  Private
router.get('/qr/generate', protect, async (req, res, next) => {
  try {
    const qrData = {
      userId: req.user._id,
      name: req.user.name,
      timestamp: Date.now(),
      expiresIn: 30 * 60 * 1000 // 30 minutes
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));

    res.json({
      success: true,
      qrCode: qrCodeDataURL,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;