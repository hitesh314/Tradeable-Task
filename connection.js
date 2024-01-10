const mongoose = require("mongoose");

// Establishes MongoDB connection using mongoose ORM.
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Tradeable');
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

module.exports = connectToMongoDB;