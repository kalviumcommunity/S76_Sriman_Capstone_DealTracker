const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    isGoogleUser: {
      type: Boolean,
      default: false, 
    },
    purchasedProducts: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    }] 
  },
  { timestamps: true }
  );

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
