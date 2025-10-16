const express = require("express");
const dotenv = require("dotenv");
const { userRouter } = require("./src/routes/user");
const { courseRouter } = require("./src/routes/course");
const { adminRouter } = require("./src/routes/admin");
const { connectDB } = require("./src/util/db");
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo db connect error: ", err);
    process.exit(1);
  });
