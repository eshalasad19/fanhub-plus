import express from "express";
import { getRecentActivity } from "../../controllers/user/activityController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getRecentActivity);

export default router;
