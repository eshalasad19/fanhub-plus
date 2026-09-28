import Tag from "../../models/Tag.js";

export const getTags = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const tags = await Tag.find(filter).sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    next(err);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json({ message: "Tag deleted" });
  } catch (err) {
    next(err);
  }
};
