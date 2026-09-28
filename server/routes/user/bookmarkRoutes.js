import express from "express";
import {
  getBookmarks,
  checkBookmark,
  addBookmark,
  removeBookmark,
  removeBookmarkByItem,
} from "../../controllers/user/bookmarkController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getBookmarks);
router.get("/check", checkBookmark);
router.post("/", addBookmark);
router.delete("/by-item", removeBookmarkByItem);
router.delete("/:id", removeBookmark);

export default router;
