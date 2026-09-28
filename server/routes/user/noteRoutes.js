import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../../controllers/user/noteController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
