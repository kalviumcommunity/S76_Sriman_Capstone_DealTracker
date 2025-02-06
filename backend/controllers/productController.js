const Product = require('../models/ProductModel');
const data = require('../data/products.json');

const getProducts = async (req, res) => {
  try {
    const existingProducts = await Product.find();

    if (existingProducts.length === 0) {
      await Product.insertMany(data);
      console.log('Sample data imported successfully.');
    }

    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

module.exports = { getProducts };
