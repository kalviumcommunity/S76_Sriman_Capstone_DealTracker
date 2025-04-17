const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Not an image! Please upload only images.'));
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

// Middleware to handle upload errors
const uploadHandler = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'File upload failed. Please try again.' });
    }
    next();
  });
};
// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products. Please try again later.' });
  }
};

// Get products by user ID
const getUserProducts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const products = await Product.find({ userId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Failed to fetch user products' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Fetch products from the database
    const dbProducts = await Product.find();

    // Fetch products from products.json using async read
    const jsonFilePath = path.join(__dirname, '../data/products.json');
    const fileContent = await fs.promises.readFile(jsonFilePath, 'utf-8');
    const jsonProducts = JSON.parse(fileContent);

    // Combine both arrays
    const allProducts = [...dbProducts, ...jsonProducts];

    res.status(200).json(allProducts);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Failed to fetch all products. Please try again later.' });
  }
};
// Create product

const createProduct = async (req, res) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user ? req.user.userId : null;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Create image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Get other product data from body
    const { name, price, rating, brand, description, platform, link } = req.body;

    // Basic validation
    if (!name || !price || !description) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: 'Please provide all required fields (name, price, description).' 
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      price: Number(price),
      rating: rating ? Number(rating) : 0,
      brand,
      description,
      platform,
      link,
      imageUrl,
      userId
    });

    // Save product
    await newProduct.save();
    res.status(201).json(newProduct);

  } catch (error) {
    // Delete uploaded file if save fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ 
      message: 'Error creating product', 
      error: error.message 
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.userId : null;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the logged-in user is the owner of the product
    if (product.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own products' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.userId : null;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the logged-in user is the owner of the product
    if (product.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own products' });
    }

    // If product has an image, delete it from filesystem
    if (product.imageUrl) {
      const imagePath = product.imageUrl.split('/uploads/')[1];
      if (imagePath) {
        const fullPath = path.join('uploads', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
};

module.exports = {
  upload: upload.single('image'),
  getProducts,
  uploadHandler,
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
};