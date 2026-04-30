import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import multer from "multer";
import Feedback from "./models/Feedback.js";
import User from "./models/User.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-feedback-system";
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID || undefined);
const ADMIN_TOKEN_COOKIE = "adminToken";
const STUDENT_TOKEN_COOKIE = "studentToken";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// Explicitly serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "public/uploads"), { maxAge: "1d" }));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

const renderPage = (res, view, options = {}, status = 200) => {
  return res.status(status).render(`pages/${view}`, {
    title: "Student Feedback System",
    currentPath: "",
    googleClientId: GOOGLE_CLIENT_ID,
    ...options
  });
};

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
};

app.get("/", (req, res) => {
  renderPage(res, "student-login", { currentPath: "/", pageKey: "student-login" });
});

app.get("/student/signup", (req, res) => {
  renderPage(res, "student-signup", { currentPath: "/student/signup", pageKey: "student-signup" });
});

const requireStudentAuth = (req, res, next) => {
  const token = req.cookies[STUDENT_TOKEN_COOKIE];
  if (!token) return res.redirect("/");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "student") return res.redirect("/");
    req.student = decoded;
    next();
  } catch {
    res.redirect("/");
  }
};

app.get("/feedback", requireStudentAuth, async (req, res) => {
  try {
    console.log("Fetching student with ID:", req.student.id);
    const student = await User.findById(req.student.id);
    console.log("Student data:", student);
    console.log("Profile pic:", student?.profilePic);
    
    renderPage(res, "feedback", { 
      currentPath: "/feedback", 
      pageKey: "feedback-student",
      studentEmail: student?.email,
      studentProfilePic: student?.profilePic
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    renderPage(res, "feedback", { 
      currentPath: "/feedback", 
      pageKey: "feedback-student"
    });
  }
});

app.get("/contact", (req, res) => {
  renderPage(res, "contact", { currentPath: "/contact", pageKey: "contact" });
});

app.get("/admin/login", (req, res) => {
  renderPage(res, "login", { currentPath: "/admin/login", pageKey: "login" });
});



const requireAuth = (req, res, next) => {
  const token = req.cookies[ADMIN_TOKEN_COOKIE];
  if (!token) return res.redirect("/admin/login");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
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

app.post("/api/auth/student-signup", upload.single('profilePic'), async (req, res) => {
  try {
    const { email, password } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : "";

    if (!email.endsWith("@chitkara.edu.in")) {
      return res.status(400).json({ error: "Only @chitkara.edu.in emails are allowed." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: "student", profilePic });
    await user.save();
    
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/student-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.endsWith("@chitkara.edu.in")) {
      return res.status(400).json({ error: "Only @chitkara.edu.in emails are allowed." });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "student") {
      return res.status(400).json({ error: "Invalid credentials or account does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie(STUDENT_TOKEN_COOKIE, token, authCookieOptions);

    res.json({ success: true, role: "student", email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (user.role !== "admin") return res.status(403).json({ error: "Access denied. Not an admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie(ADMIN_TOKEN_COOKIE, token, authCookieOptions);
    res.json({ success: true, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(ADMIN_TOKEN_COOKIE, authCookieOptions);
  res.clearCookie(STUDENT_TOKEN_COOKIE, authCookieOptions);
  res.json({ success: true });
});

// A simple GET route so you can forcefully logout by visiting the URL
app.get("/logout", (req, res) => {
  res.clearCookie(ADMIN_TOKEN_COOKIE, authCookieOptions);
  res.clearCookie(STUDENT_TOKEN_COOKIE, authCookieOptions);
  res.redirect("/admin/login");
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

    // First check if it's an admin in our database
    const user = await User.findOne({ email });
    if (user && user.role === "admin") {
      // Sign token
      const jwtToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
      res.cookie(ADMIN_TOKEN_COOKIE, jwtToken, authCookieOptions);
      return res.json({ success: true, role: user.role, email: user.email });
    }

    // Check if it's a student trying to log in for feedback
    if (email.endsWith("@chitkara.edu.in")) {
      let studentUser = await User.findOne({ email });

      if (!studentUser) {
        studentUser = await User.create({ email, role: "student" });
      }

      if (studentUser.role !== "student") {
        return res.status(403).json({ error: "Access denied for this account." });
      }

      const jwtToken = jwt.sign({ id: studentUser._id, email: studentUser.email, role: studentUser.role }, JWT_SECRET, { expiresIn: "1d" });
      res.cookie(STUDENT_TOKEN_COOKIE, jwtToken, authCookieOptions);
      return res.json({ success: true, role: "student", email: studentUser.email });
    }

    return res.status(403).json({ error: "Access denied. Not an admin or a student." });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google Token" });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ email: user?.email, role: user?.role, profilePic: user?.profilePic });
  } catch (err) {
    res.json({ email: req.user.email, role: req.user.role });
  }
});

app.get("/api/auth/student-me", requireStudentAuth, async (req, res) => {
  try {
    const student = await User.findById(req.student.id);
    res.json({ email: student?.email, role: student?.role, profilePic: student?.profilePic });
  } catch (err) {
    res.json({ email: req.student.email, role: req.student.role });
  }
});

// Upload student profile picture
app.post("/api/auth/student-upload-pic", requireStudentAuth, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const profilePic = `/uploads/${req.file.filename}`;
    const student = await User.findByIdAndUpdate(req.student.id, { profilePic }, { new: true });
    res.json({ success: true, profilePic: student.profilePic });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
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
app.post("/api/feedbacks", requireStudentAuth, async (req, res) => {
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
app.delete("/api/feedbacks/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Only admins can delete feedback." });
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

// Clear all feedbacks (for demo purposes)
app.delete("/api/feedbacks", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Only admins can clear feedback." });
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
