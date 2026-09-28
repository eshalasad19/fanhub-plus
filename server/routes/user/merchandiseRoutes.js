import express from "express";
import {
  getMerchandise,
  getMerchandiseById,
  createMerchandise,
  updateMerchandise,
  deleteMerchandise,
} from "../../controllers/user/merchandiseController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getMerchandise);
router.get("/:id", protect, getMerchandiseById);
router.post("/", createMerchandise);
router.put("/:id", updateMerchandise);
router.delete("/:id", deleteMerchandise);

export default router;
