import mongoose from "mongoose";
import dotenv from "dotenv";
import Feedback from "./models/Feedback.js";

dotenv.config();

const cleanUp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
