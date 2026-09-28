import express from "express";
import {
  getCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "../../controllers/user/characterController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCharacters);
router.get("/:id", protect, getCharacterById);
router.post("/", createCharacter);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

export default router;
