const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Upload', UploadSchema);