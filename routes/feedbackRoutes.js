import express from "express";
import {
  getAllFeedbacks,
  submitFeedback,
  deleteFeedback,
  clearAllFeedbacks
} from "../controllers/feedbackController.js";
import { requireAuth, requireStudentAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllFeedbacks);
router.post("/", requireStudentAuth, submitFeedback);
router.delete("/:id", requireAuth, deleteFeedback);
router.delete("/", requireAuth, clearAllFeedbacks);

export default router;
