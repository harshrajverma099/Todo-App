const jwt = require("jsonwebtoken")
require("dotenv").config({path: "./plaintext.env"});

const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    const decodedInformation = jwt.verify(token, JWT_SECRET);
    req.userId = decodedInformation.userId;
    next(); 
  } catch (error) {
    return res.status(403).json({ message: 'Incorrect Credentials' });
  }
}

module.exports = {
    auth,
    JWT_SECRET
}