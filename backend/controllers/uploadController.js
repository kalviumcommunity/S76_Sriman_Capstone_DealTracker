const Upload = require('../models/Upload');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage }).any();

exports.uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err.message });
    }
    
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const uploadedFiles = req.files.map(file => ({
        fileName: file.filename,
        filePath: file.path,
      }));

      // Save only the first file (if handling one upload at a time)
      const newUpload = new Upload(uploadedFiles[0]);
      await newUpload.save();

      res.status(201).json({ message: 'File uploaded successfully', data: newUpload });
    } catch (error) {
      res.status(500).json({ message: 'Error saving file info', error: error.message });
    }
  });
};


exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find();
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching uploads', error: error.message });
  }
};