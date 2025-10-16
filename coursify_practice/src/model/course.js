const { Schema, default: mongoose } = require("mongoose");

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    imageUrl: {
      type: String,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const courseModel = mongoose.model("Course", courseSchema);

module.exports = {
  courseModel: courseModel,
};
