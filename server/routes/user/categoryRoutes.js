import express from "express";
import { getCategories, createCategory, seedCategories } from "../../controllers/user/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.post("/seed", seedCategories);

export default router;
