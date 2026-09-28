import Tag from "../../models/Tag.js";

export const getTags = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const tags = await Tag.find(filter).sort({ name: 1 });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tags", error: err.message });
  }
};

export const createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ message: "Failed to create tag", error: err.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json(tag);
  } catch (err) {
    res.status(400).json({ message: "Failed to update tag", error: err.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json({ message: "Tag deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tag", error: err.message });
  }
};
