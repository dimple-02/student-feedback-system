import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const cleanUpUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
