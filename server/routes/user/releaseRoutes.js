import express from "express";
import { getReleases, getReleaseById } from "../../controllers/user/releaseController.js";



const router = express.Router();

router.get("/", getReleases);
router.get("/:id", getReleaseById);

export default router;
