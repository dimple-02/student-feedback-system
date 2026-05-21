import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-feedback-system";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "admin@chitkara.edu.in";
    const password = "password123";

    // Check if admin already exists
    let admin = await User.findOne({ email });

    if (admin) {
      console.log("Admin account already exists with email:", email);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new User({
        email: email,
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();
      console.log("✅ Admin account successfully created!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
