const { Router } = require("express");
const { userModel } = require("../model/user");
const jwt = require("jsonwebtoken");
const { adminModel } = require("../model/admin");

const adminSecret = process.env.JWT_ADMIN_SECRET || "default_user_secret";
console.log("adminSecret:", adminSecret);
console.log("JWT_ADMIN_SECRET:", process.env.JWT_ADMIN_SECRET);

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Todo: Add more validations as needed (e.g., email format, password strength)
  // Todo: hash the password before storing it

  try {
    const user = await adminModel.create({
      email,
      password,
      firstname,
      lastname,
    });
    res
      .status(201)
      .json({ message: "Admin created successfully", userId: user._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      const user = await adminModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Admin not found" });
      }
      // Todo: Compare hashed password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user._id }, adminSecret, {
        expiresIn: "1h",
      });
  
      // Todo: cookie logic
  
      res.status(200).json({ message: "Signin successful", token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
});

adminRouter.post("/course", (req, res) => {
  res.json({
    message: "create-course endpoint",
  });
});

adminRouter.put("/course/:courseId", (req, res) => {
  res.json({
    message: "edit-course endpoint",
  });
});

adminRouter.get("/course/bulk", (req, res) => {
  res.json({
    message: "all-courses endpoint",
  });
});

module.exports = {
  adminRouter: adminRouter,
};
