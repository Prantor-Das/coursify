const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// make a constant file for dotenv variables
const adminSecret = process.env.JWT_ADMIN_SECRET || "default_admin_secret";

function adminMiddleware(req, res, next) {
  const token =
    req.cookies?.token ||
    req.headers?.authorization?.replace("Bearer ", "") ||
    null;

  // Check

  // console.log("Token from cookies:", req.cookies?.token);
  // console.log("Token from headers:", req.headers?.authorization?.replace("Bearer ", ""));
  // console.log("Extracted token:", token);

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, adminSecret);
    req.userId = decoded.id || decoded.userId; // Attach decoded token to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  adminMiddleware,
};
