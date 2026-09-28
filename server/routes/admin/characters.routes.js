import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { getCharacters, getCharacterById, createCharacter, updateCharacter, deleteCharacter } from "../../controllers/admin/character.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getCharacters);
router.get("/:id", getCharacterById);
router.post("/", createCharacter);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

export default router;
