const { Router } = require("express");
const { userModel } = require("../model/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { adminModel } = require("../model/admin");
const { adminMiddleware } = require("../middleware/admin");
const { courseModel } = require("../model/course");

dotenv.config();

const adminSecret = process.env.JWT_ADMIN_SECRET || "default_user_secret";

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Todo: Add more validations as needed (e.g., email format, password strength)
  // Todo: hash the password before storing it

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await adminModel.create({
      email,
      password: hashedPassword,
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, adminSecret, {
      expiresIn: "1h",
    });

    // Todo: cookie logic
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 3600000,
    }); 

    res.status(200).json({ message: "Signin successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  const { title, description, price, imageUrl } = req.body;
  if (!title || !description || !price || !imageUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(price)) {
  return res.status(400).json({ message: "Price must be a number" });
}

  try {
    const course = await courseModel.create({
      title,
      description,
      price,
      imageUrl,
      createdBy: adminId, // Use the extracted adminId
    });
    
    res
      .status(201)
      .json({ message: "Course created successfully", courseId: course._id });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

adminRouter.put("/course/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, imageUrl } = req.body;

  try {
    const updatedCourse = await courseModel.findByIdAndUpdate(
      courseId,
      { title, description, price, imageUrl },
      { new: true } // returns the updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


adminRouter.get("/course/bulk", async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
