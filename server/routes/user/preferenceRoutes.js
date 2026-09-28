import express from "express";
import { getPreferences, updatePreferences } from "../../controllers/user/preferenceController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getPreferences);
router.put("/", updatePreferences);

export default router;
