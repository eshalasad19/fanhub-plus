import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { getSummary, getEventsByCategory } from "../../controllers/admin/analytics.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/summary", getSummary);
router.get("/events-by-category", getEventsByCategory);

export default router;
