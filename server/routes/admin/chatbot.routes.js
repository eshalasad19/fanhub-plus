import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { sendMessage, getHistory, deleteHistory } from "../../controllers/admin/chatbotController.js";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "../../controllers/admin/chatbotFaq.controller.js";

const router = express.Router();


router.post("/message", sendMessage);
router.get("/history", getHistory);
router.delete("/history", deleteHistory);


router.get("/faqs", protect, adminOnly, getFaqs);
router.post("/faqs", protect, adminOnly, createFaq);
router.put("/faqs/:id", protect, adminOnly, updateFaq);
router.delete("/faqs/:id", protect, adminOnly, deleteFaq);

export default router;
