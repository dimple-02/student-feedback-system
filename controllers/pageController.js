import User from "../models/User.js";
import { GOOGLE_CLIENT_ID } from "../config/constants.js";

const renderPage = (res, view, options = {}, status = 200) => {
  return res.status(status).render(`pages/${view}`, {
    title: "Student Feedback System",
    currentPath: "",
    googleClientId: GOOGLE_CLIENT_ID,
    ...options
  });
};

export const getStudentLogin = (req, res) => {
  renderPage(res, "student-login", { currentPath: "/", pageKey: "student-login" });
};

export const getStudentSignup = (req, res) => {
  renderPage(res, "student-signup", { currentPath: "/student/signup", pageKey: "student-signup" });
};

export const getFeedback = async (req, res) => {
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
};

export const getContact = (req, res) => {
  renderPage(res, "contact", { currentPath: "/contact", pageKey: "contact" });
};

export const getAdminLogin = (req, res) => {
  renderPage(res, "login", { currentPath: "/admin/login", pageKey: "login" });
};

export const getAdminDashboard = (req, res) => {
  renderPage(res, "dashboard", { currentPath: "/admin", pageKey: "dashboard" });
};

export const getAdminFeedback = (req, res) => {
  renderPage(res, "feedback", { currentPath: "/admin/feedback", pageKey: "feedback-admin" });
};

export const getAdminAnalytics = (req, res) => {
  renderPage(res, "analytics", { currentPath: "/admin/analytics", pageKey: "analytics" });
};

export const getAdminProfile = (req, res) => {
  renderPage(res, "profile", { currentPath: "/admin/profile", pageKey: "profile" });
};

export const handleNotFound = (req, res) => {
  renderPage(res, "not-found", { currentPath: req.path, pageKey: "not-found" }, 404);
};
