const mongoose = require('mongoose');
const Product = require('../models/ProductModel');


// Get Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message 
    });
  }
};

// Create a New Product
const createProduct = async (req, res) => {
  const { name, price, rating, brand, description, platform, link, imageUrl } = req.body;


  if (!name || !price || !description || !imageUrl) {
    return res.status(400).json({ 
      message: 'Please provide all required fields (name, price, description, imageUrl).'
     });
  }

  try {
    const newProduct = new Product({ name, price, rating, brand, description, platform, link, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating product', 
      error: error.message 
    });
  }
};

// Update 
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  const { name, price, rating, brand, description, platform, link, imageUrl } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, rating, brand, description, platform, link, imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};



module.exports = { getProducts, createProduct , updateProduct };
