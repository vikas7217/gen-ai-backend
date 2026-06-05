const mongoose = require("mongoose");
const DB_CONNECTION_STRING = process.env.MONGO_URI;
async function connectDb() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    console.log("✅ Database connected successfully");
    console.log("Connection state:", mongoose.connection.readyState);
  } catch (error) {
    console.error("Database connection error:", error.module);
  }
}

module.exports = connectDb;
    