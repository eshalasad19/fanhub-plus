import express from "express";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../controllers/user/articleController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", protect, getArticleById);
router.post("/", createArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
