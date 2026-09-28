import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { getMerchandise, getMerchandiseById, createMerchandise, updateMerchandise, deleteMerchandise } from "../../controllers/admin/merchandise.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getMerchandise);
router.get("/:id", getMerchandiseById);
router.post("/", createMerchandise);
router.put("/:id", updateMerchandise);
router.delete("/:id", deleteMerchandise);

export default router;
