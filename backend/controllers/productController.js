const Product = require('../models/ProductModel');

// Get Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Create a New Product
const createProduct = async (req, res) => {
  const { name, price, rating, brand, description, platform, link, imageUrl } = req.body;

  // Basic validation for required fields
  if (!name || !price || !description || !imageUrl) {
    return res.status(400).json({ message: 'Please provide all required fields (name, price, description, imageUrl).' });
  }

  try {
    const newProduct = new Product({ name, price, rating, brand, description, platform, link, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

module.exports = { getProducts, createProduct };
