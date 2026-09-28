import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} from "../../controllers/user/contentController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getContent);
router.get("/:id", getContentById);
router.post("/", createContent);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);

export default router;
