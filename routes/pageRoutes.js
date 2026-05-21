import express from "express";
import {
  getStudentLogin,
  getStudentSignup,
  getFeedback,
  getContact,
  getAdminLogin,
  getAdminDashboard,
  getAdminFeedback,
  getAdminAnalytics,
  getAdminProfile
} from "../controllers/pageController.js";
import { getLogoutRedirect } from "../controllers/authController.js";
import { requireStudentAuth, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getStudentLogin);
router.get("/student/signup", getStudentSignup);
router.get("/feedback", requireStudentAuth, getFeedback);
router.get("/contact", getContact);
router.get("/admin/login", getAdminLogin);
router.get("/logout", getLogoutRedirect);

// Admin routes
router.get("/admin", requireAuth, getAdminDashboard);
router.get("/admin/feedback", requireAuth, getAdminFeedback);
router.get("/admin/analytics", requireAuth, getAdminAnalytics);
router.get("/admin/profile", requireAuth, getAdminProfile);

export default router;
