import Note from "../../models/Note.js";
import { logActivity } from "../../utils/activityLogger.js";


export const getNotes = async (req, res) => {
  try {
    const { itemType, itemId } = req.query;
    const filter = { user: req.user._id };
    if (itemType) filter.itemType = itemType;
    if (itemId) filter.itemId = itemId;

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err.message });
  }
};


export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch note", error: err.message });
  }
};


export const createNote = async (req, res) => {
  try {
    const { title, body, itemType, itemId } = req.body;
    if (!body) return res.status(400).json({ message: "Note body is required" });

    const note = await Note.create({
      user: req.user._id,
      title: title || "",
      body,
      itemType: itemType || "General",
      itemId: itemId || null,
    });

    await logActivity({
      user: req.user._id,
      type: "note_added",
      itemType: note.itemType,
      itemId: note.itemId,
      message: "Added a new note",
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: "Failed to create note", error: err.message });
  }
};


export const updateNote = async (req, res) => {
  try {
    const { title, body } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (body !== undefined) update.body = body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ message: "Failed to update note", error: err.message });
  }
};


export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note", error: err.message });
  }
};
