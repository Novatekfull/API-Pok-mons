require("dotenv").config();
const mongoose = require("mongoose");

const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/mon-api-pokemon",
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },
};

async function connectDB() {
  try {
    await mongoose.connect(config.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connecté à MongoDB");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = {
  config,
  connectDB,
};
