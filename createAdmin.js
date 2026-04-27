import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "admin@chitkara.edu.in"; // Aap apna koi bhi email yahan daal sakte hain
    const password = "password123";

    // Pehle check karte hain ki admin pehle se exist karta hai ya nahi
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
