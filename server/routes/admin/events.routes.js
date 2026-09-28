import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import {
  getEvents,
  getEventById,
  getNearbyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../controllers/admin/event.controller.js";
import Event from "../../models/Event.js";

const router = express.Router();


router.get("/", getEvents);

router.get("/nearby", getNearbyEvents);

router.get("/:id", protect, getEventById);


router.post("/:id/view", async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ ok: true });
  } catch { res.status(500).json({ message: "Failed to track view" }); }
});


router.post("/", protect, adminOnly, createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
