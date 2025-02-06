require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/database');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', productRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  });
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
