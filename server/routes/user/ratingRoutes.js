import express from "express";
import { submitRating, getRatingsForTarget } from "../../controllers/user/ratingController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, submitRating);
router.get("/:targetType/:targetId", getRatingsForTarget);

export default router;
