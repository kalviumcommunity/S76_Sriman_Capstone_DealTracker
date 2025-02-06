const Product = require('../models/ProductModel');
const data = require('../data/products.json');

const getProducts = async (req, res, next) => {
  try {
    for (const product of data) {
      await Product.findOneAndUpdate(
        { name: product.name }, 
        product, 
        { upsert: true, new: true }
      );
    }

    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error); 
  }
};

module.exports = { getProducts };
