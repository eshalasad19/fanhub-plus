import express from "express";
import { protect, optionalAuth, adminOnly } from "../../middleware/auth.middleware.js";
import {
  getFeedbackList,
  createFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  checkUserFeedbackStatus,
} from "../../controllers/admin/feedback.controller.js";

const router = express.Router();


router.get("/my-status", optionalAuth, checkUserFeedbackStatus);


router.post("/", optionalAuth, createFeedback);


router.get("/", protect, adminOnly, getFeedbackList);
router.put("/:id", protect, adminOnly, updateFeedbackStatus);
router.delete("/:id", protect, adminOnly, deleteFeedback);

export default router;
