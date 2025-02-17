const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Upload = require('../models/Upload'); 

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MAX_FILE_SIZE = 2 * 1024 * 1024; 

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Secure storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  },
});

// Multer upload middleware with validation
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, 
  fileFilter: (req, file, cb) => {
    if (!allowedFileTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'));
    }
    cb(null, true);
  },
}).single('file'); 

// Secure file upload controller
exports.uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      // Save file details to the database
      const newUpload = new Upload({
        fileName: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      });

      await newUpload.save();

      res.status(201).json({
        message: 'File uploaded successfully',
        data: {
          fileName: newUpload.fileName,
          fileUrl: `/uploads/${newUpload.fileName}`,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error saving file info', error: error.message });
    }
  });
};

// Get all uploaded files
exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find();
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching uploads', error: error.message });
  }
};
