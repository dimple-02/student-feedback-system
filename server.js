import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import Feedback from "./models/Feedback.js";
import User from "./models/User.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

const renderPage = (res, view, options = {}, status = 200) => {
  return res.status(status).render(`pages/${view}`, {
    title: "Student Feedback System",
    currentPath: "",
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    ...options
  });
};

app.get("/", (req, res) => {
  renderPage(res, "student-login", { currentPath: "/", pageKey: "student-login" });
});

app.get("/feedback", (req, res) => {
  renderPage(res, "feedback", { currentPath: "/feedback", pageKey: "feedback-student" });
});

app.get("/contact", (req, res) => {
  renderPage(res, "contact", { currentPath: "/contact", pageKey: "contact" });
});

app.get("/admin/login", (req, res) => {
  renderPage(res, "login", { currentPath: "/admin/login", pageKey: "login" });
});

app.get("/admin/setup", (req, res) => {
  renderPage(res, "admin-setup", { currentPath: "/admin/setup", pageKey: "admin-setup" });
});

const requireAuth = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.redirect("/admin/login");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.redirect("/admin/login");
  }
};

app.get("/admin", requireAuth, (req, res) => {
  renderPage(res, "dashboard", { currentPath: "/admin", pageKey: "dashboard" });
});

app.get("/admin/feedback", requireAuth, (req, res) => {
  renderPage(res, "feedback", { currentPath: "/admin/feedback", pageKey: "feedback-admin" });
});

app.get("/admin/analytics", requireAuth, (req, res) => {
  renderPage(res, "analytics", { currentPath: "/admin/analytics", pageKey: "analytics" });
});

app.get("/admin/profile", requireAuth, (req, res) => {
  renderPage(res, "profile", { currentPath: "/admin/profile", pageKey: "profile" });
});

// --- API ROUTES ---

// Auth APIs
app.post("/api/auth/setup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.endsWith("@chitkara.edu.in")) return res.status(400).json({ error: "Students cannot be admins." });
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.endsWith("@chitkara.edu.in")) return res.status(400).json({ error: "Students cannot be admins." });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("adminToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ success: true, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({ success: true });
});

app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    // Check if it's a student trying to log in for feedback
    if (email.endsWith("@chitkara.edu.in")) {
      // It's a student. Return success. The frontend will set sessionStorage.
      return res.json({ success: true, role: "student", email });
    }

    // Otherwise, check if it's an admin
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }

    // Sign admin token
    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("adminToken", jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ success: true, role: "admin", email: user.email });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google Token" });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ email: req.user.email });
});

// Get all feedbacks
app.get("/api/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

// Submit a new feedback
app.post("/api/feedbacks", async (req, res) => {
  try {
    const { course, message, rating } = req.body;
    const newFeedback = new Feedback({ course, message, rating });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// Delete a feedback
app.delete("/api/feedbacks/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

// Clear all feedbacks (for demo purposes)
app.delete("/api/feedbacks", async (req, res) => {
  try {
    await Feedback.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear feedbacks" });
  }
});

app.use((req, res) => {
  renderPage(res, "not-found", { currentPath: req.path, pageKey: "not-found" }, 404);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
