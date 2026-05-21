import express from "express";
import {
  studentSignup,
  studentLogin,
  adminLogin,
  logout,
  googleAuth,
  getAdminMe,
  getStudentMe,
  uploadStudentProfilePic
} from "../controllers/authController.js";
import { requireAuth, requireStudentAuth } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/student-signup", upload.single("profilePic"), studentSignup);
router.post("/student-login", studentLogin);
router.post("/login", adminLogin);
router.post("/logout", logout);
router.post("/google", googleAuth);

router.get("/me", requireAuth, getAdminMe);
router.get("/student-me", requireStudentAuth, getStudentMe);
router.post("/student-upload-pic", requireStudentAuth, upload.single("profilePic"), uploadStudentProfilePic);

export default router;
