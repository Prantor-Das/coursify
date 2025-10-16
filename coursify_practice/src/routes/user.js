const { Router } = require("express");
const { userModel } = require("../model/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userSecret = process.env.JWT_USER_SECRET || "default_user_secret";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  // Basic validation
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Todo: Add more validations as needed (e.g., email format, password strength)
  // Todo: hash the password before storing it

  try {
    const user = await userModel.create({
      email,
      password,
      firstname,
      lastname,
    });
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Todo: Compare hashed password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, userSecret, {
      expiresIn: "1h",
    });

    // Todo: cookie logic

    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

userRouter.get("/purchase", (req, res) => {
  res.json({
    message: "purchase endpoint",
  });
});

module.exports = {
  userRouter: userRouter,
};
