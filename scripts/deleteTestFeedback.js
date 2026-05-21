import "dotenv/config";
import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";

const cleanUp = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-feedback-system";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for cleanup.");

    const result = await Feedback.deleteMany({
      $or: [
        { course: { $regex: /janvu|xyz/i } },
        { message: { $regex: /janvu|xyz/i } },
        { name: { $regex: /janvu|xyz/i } }
      ]
    });

    console.log(`Deleted ${result.deletedCount} feedback entries containing "janvu" or "xyz".`);
  } catch (err) {
    console.error("Cleanup error:", err);
  } finally {
    mongoose.connection.close();
  }
};

cleanUp();
