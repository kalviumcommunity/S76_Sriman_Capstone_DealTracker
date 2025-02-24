const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 5 
  },
  brand: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  platform: { 
    type: String, 
    required: true 
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /^(https?|ftp):\/\/((([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,}|\d{1,3}(\.\d{1,3}){3}|localhost)(:\d+)?(\/[^\s]*)?$/i.test(v),
      message: (props) => `${props.value} is not a valid URL`,
    },
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
