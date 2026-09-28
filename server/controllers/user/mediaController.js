import Media from "../../models/Media.js";
import { paginate, buildMeta, resolveCategoryId, resolveContentId } from "../../utils/queryHelpers.js";

export const getMedia = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = await resolveCategoryId(req.query.category);
    if (req.query.mediaType) filter.mediaType = req.query.mediaType;
    const fandomQuery = req.query.fandom || req.query.content;
    if (fandomQuery) filter.content = await resolveContentId(fandomQuery);
    if (req.query.q) filter.title = { $regex: req.query.q, $options: "i" };

    const { page, limit, skip } = paginate(req.query);
    const [items, total] = await Promise.all([
      Media.find(filter).populate("category", "name").populate("content", "title").skip(skip).limit(limit),
      Media.countDocuments(filter),
    ]);

    res.json({ items, meta: buildMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
};

export const getMediaById = async (req, res, next) => {
  try {
    const item = await Media.findById(req.params.id).populate("category", "name").populate("content", "title");
    if (!item) return res.status(404).json({ message: "Media not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createMedia = async (req, res, next) => {
  try {
    const item = await Media.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateMedia = async (req, res, next) => {
  try {
    const item = await Media.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Media not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const item = await Media.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Media not found" });
    res.json({ message: "Media deleted" });
  } catch (err) {
    next(err);
  }
};
