import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    // Password may not be required if added manually without one (e.g. for Google OAuth admins)
    required: false,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  profilePic: {
    type: String,
    default: "",
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
