import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createTeacher = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "teacher@chitkara.edu.in"; // Aap apna koi bhi email yahan daal sakte hain
    const password = "password123";

    let teacher = await User.findOne({ email });

    if (teacher) {
      console.log("Teacher account already exists with email:", email);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      teacher = new User({
        email: email,
        password: hashedPassword,
        role: "teacher",
      });

      await teacher.save();
      console.log("✅ Teacher account successfully created!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

  } catch (err) {
    console.error("Error creating teacher:", err);
  } finally {
    mongoose.connection.close();
  }
};

createTeacher();
