import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import pageRoutes from "./routes/pageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { handleNotFound } from "./controllers/pageController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
connectDB();

// Express Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
// Explicitly serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "public/uploads"), { maxAge: "1d" }));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/", pageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedbacks", feedbackRoutes);

// 404 Handler
app.use(handleNotFound);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
