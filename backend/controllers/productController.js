const Product = require('../models/ProductModel');
const data = require('../data/products.json');

const getProducts = async (req, res) => {
  try {
    
    await Product.deleteMany(); 
    await Product.insertMany(data); 

    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

module.exports = { getProducts };
