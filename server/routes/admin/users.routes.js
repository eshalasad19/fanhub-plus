import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { getUsers, getUserById, updateUser, toggleBlockUser, deleteUser } from "../../controllers/admin/user.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/block", toggleBlockUser);
router.delete("/:id", deleteUser);

export default router;
