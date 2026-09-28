import express from "express";
import {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getRecommendedContent,
  getTrendingContent,
} from "../../controllers/user/contentController.js";
import { protect } from "../../middleware/auth.middleware.js";
import Content from "../../models/Content.js";

const router = express.Router();

router.get("/", getContent);


router.get("/recommended", protect, getRecommendedContent);
router.get("/trending", getTrendingContent);
router.get("/:id", protect, getContentById);
router.post("/", createContent);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);


router.post("/:id/view", async (req, res) => {
  try {
    await Content.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ ok: true });
  } catch { res.status(500).json({ message: "Failed to track view" }); }
});

export default router;
