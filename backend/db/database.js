const mongoose = require('mongoose');

const connectDB = async () => {
  const DB = process.env.MONGO_URI
  try {
    await mongoose.connect( DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
