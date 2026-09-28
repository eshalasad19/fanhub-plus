import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../controllers/admin/category.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
