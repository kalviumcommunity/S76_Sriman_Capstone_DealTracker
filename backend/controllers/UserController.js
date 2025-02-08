const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return token and userId
    res.status(200).json({ message: 'Login successful', token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


const purchaseProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    if (user.purchasedProducts.includes(productId)) {
      return res.status(400).json({ message: 'Product already purchased' });
    }

    user.purchasedProducts.push(product._id);
    await user.save();

    res.status(200).json({ 
      message: 'Product purchased successfully', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        purchasedProducts: user.purchasedProducts 
      },
      purchasedProductDetails: product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing product', error: error.message });
  }
};

module.exports = { registerUser, loginUser ,purchaseProduct};
