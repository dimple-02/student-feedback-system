import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  ADMIN_TOKEN_COOKIE,
  STUDENT_TOKEN_COOKIE,
  authCookieOptions
} from "../config/constants.js";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID || undefined);

export const studentSignup = async (req, res) => {
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
};

export const studentLogin = async (req, res) => {
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
};

export const adminLogin = async (req, res) => {
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
};

export const logout = (req, res) => {
  res.clearCookie(ADMIN_TOKEN_COOKIE, authCookieOptions);
  res.clearCookie(STUDENT_TOKEN_COOKIE, authCookieOptions);
  res.json({ success: true });
};

export const getLogoutRedirect = (req, res) => {
  res.clearCookie(ADMIN_TOKEN_COOKIE, authCookieOptions);
  res.clearCookie(STUDENT_TOKEN_COOKIE, authCookieOptions);
  res.redirect("/admin/login");
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
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
};

export const getAdminMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ email: user?.email, role: user?.role, profilePic: user?.profilePic });
  } catch (err) {
    res.json({ email: req.user.email, role: req.user.role });
  }
};

export const getStudentMe = async (req, res) => {
  try {
    const student = await User.findById(req.student.id);
    res.json({ email: student?.email, role: student?.role, profilePic: student?.profilePic });
  } catch (err) {
    res.json({ email: req.student.email, role: req.student.role });
  }
};

export const uploadStudentProfilePic = async (req, res) => {
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
};
