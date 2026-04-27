import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous",
  },
  course: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  role: {
    type: String,
    default: "student",
  }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
