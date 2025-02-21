const express = require('express');
const router = express.Router();
const { registerUser, loginUser , purchaseProduct } = require('../controllers/UserController');


// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/purchase', purchaseProduct);


module.exports = router;