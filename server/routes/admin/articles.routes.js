import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from "../../controllers/admin/article.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
