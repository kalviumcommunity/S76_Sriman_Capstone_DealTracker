const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 0, max: 5 },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  platform: { type: String, required: true },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(v),
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(v),
      message: (props) => `${props.value} is not a valid image URL`,
    },
  },
});

module.exports = mongoose.model('Product', productSchema);
