const jwt = require("jsonwebtoken");
require("dotenv").config(); // 🔥 ENV LOAD

const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.ACCESS_SECRET, // ✅ ENV
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.REFRESH_SECRET, // ✅ ENV
    { expiresIn: "7d" }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
