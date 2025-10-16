const express = require("express");
const dotenv = require("dotenv");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const { connectDB } = require("./util/db");
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config({
  path: "./.env",
});

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
