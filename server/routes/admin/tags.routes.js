import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { getTags, createTag, updateTag, deleteTag } from "../../controllers/admin/tag.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getTags);
router.post("/", createTag);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;
