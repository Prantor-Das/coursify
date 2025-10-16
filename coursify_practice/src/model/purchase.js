const { Schema, default: mongoose } = require("mongoose");

const purchaseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const purchaseModel = mongoose.model("Purchase", purchaseSchema);

module.exports = {
  purchaseModel: purchaseModel,
}; 