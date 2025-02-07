const Product = require('../models/ProductModel');
const data = require('../data/products.json');

// Get Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Create a New Product
const createProduct = async (req, res) => {
  try {
    const { name, price, rating, brand, description, platform, link, imageUrl } = req.body;
    const newProduct = new Product({ name, price, rating, brand, description, platform, link, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

module.exports = { getProducts, createProduct };
