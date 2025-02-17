const express = require('express');
const { uploadFile, getUploads } = require('../controllers/uploadController');
const router = express.Router();

router.post('/upload', uploadFile);
router.get('/uploads', getUploads);

module.exports = router;