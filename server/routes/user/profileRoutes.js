import express from "express";
import {
  getProfile,
  updateProfile,
  updateFavoriteCategories,
  changePassword,
  becomeContributor,
} from "../../controllers/user/profileController.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/favorite-categories", updateFavoriteCategories);
router.put("/password", changePassword);
router.post("/become-contributor", becomeContributor);

export default router;
