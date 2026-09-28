import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import {
  getReleases,
  getReleaseById,
  createRelease,
  updateRelease,
  deleteRelease,
} from "../../controllers/admin/releaseController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getReleases);
router.get("/:id", getReleaseById);
router.post("/", createRelease);
router.put("/:id", updateRelease);
router.delete("/:id", deleteRelease);

export default router;
