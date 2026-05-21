import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const cleanUpUsers = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-feedback-system";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for user cleanup.");

    const result = await User.deleteMany({
      $or: [
        { email: { $regex: /janvu|xyz/i } }
      ]
    });

    console.log(`Deleted ${result.deletedCount} user entries containing "janvu" or "xyz".`);
  } catch (err) {
    console.error("Cleanup error:", err);
  } finally {
    mongoose.connection.close();
  }
};

cleanUpUsers();
