import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { getMultimedia, getMultimediaById, createMultimedia, updateMultimedia, deleteMultimedia } from "../../controllers/admin/multimedia.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getMultimedia);
router.get("/:id", getMultimediaById);
router.post("/", createMultimedia);
router.put("/:id", updateMultimedia);
router.delete("/:id", deleteMultimedia);

export default router;
