const mongoose = require('mongoose');

const urlRegex = /^(https?|ftp):\/\/((([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,63}|\d{1,3}(\.\d{1,3}){3}|localhost)(:\d+)?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/i;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: false
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    platform: {
      type: String,
      required: [true, 'Platform is required']
    },
    link: {
      type: String,
      required: [true, 'Product link is required'],
      validate: {
        validator: (v) =>urlRegex.test(v),
        message: (props) => `${props.value} is not a valid URL`
      }
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
