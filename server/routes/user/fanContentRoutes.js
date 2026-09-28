import express from "express";
import { protect, optionalAuth, contributorOnly } from "../../middleware/auth.middleware.js";
import {
  getPublicFanContent,
  getPublicFanContentById,
  getMySubmissions,
  getMyAnalytics,
} from "../../controllers/user/fanContentController.js";

const router = express.Router();



router.get("/mine", protect, contributorOnly, getMySubmissions);
router.get("/analytics", protect, contributorOnly, getMyAnalytics);
router.get("/", getPublicFanContent);
router.get("/:id", optionalAuth, getPublicFanContentById);

export default router;
