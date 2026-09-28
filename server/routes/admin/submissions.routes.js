import express from "express";
import { protect, adminOnly, contributorOnly } from "../../middleware/auth.middleware.js";
import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmissionStatus,
  deleteSubmission,
} from "../../controllers/admin/fanSubmission.controller.js";

const router = express.Router();



router.post("/", protect, contributorOnly, createSubmission);


router.get("/", protect, adminOnly, getSubmissions);
router.get("/:id", protect, adminOnly, getSubmissionById);
router.put("/:id", protect, adminOnly, updateSubmissionStatus);
router.delete("/:id", protect, adminOnly, deleteSubmission);

export default router;
