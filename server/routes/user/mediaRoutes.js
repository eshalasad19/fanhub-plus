import express from "express";
import {
  getMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../../controllers/user/mediaController.js";
import Media from "../../models/Media.js";

const router = express.Router();

router.get("/", getMedia);
router.get("/:id", getMediaById);
router.post("/", createMedia);
router.put("/:id", updateMedia);
router.delete("/:id", deleteMedia);


router.post("/:id/view", async (req, res) => {
  try {
    await Media.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ ok: true });
  } catch { res.status(500).json({ message: "Failed to track view" }); }
});

export default router;
