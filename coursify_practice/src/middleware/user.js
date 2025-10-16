const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userSecret = process.env.JWT_USER_SECRET || "default_user_secret";

function userMiddleware(req, res, next) {
  console.log(req.headers);
  
  const token = req.cookies.token;
  // const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token in Authorization header
  console.log("Token from cookies:", token);
  console.log("Token from headers:", req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, userSecret);
    req.userId = decoded.id; // Attach decoded token to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  userMiddleware,
};