import express from "express";
import { getContributors, getContributorProfile } from "../../controllers/user/communityController.js";

const router = express.Router();

router.get("/", getContributors);
router.get("/:id", getContributorProfile);

export default router;
