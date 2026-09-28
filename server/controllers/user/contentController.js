import Content from "../../models/Content.js";
import Tag from "../../models/Tag.js";
import { buildContentFilter, buildSort, paginate, buildMeta, resolveCategoryId } from "../../utils/queryHelpers.js";

export const getContent = async (req, res, next) => {
  try {
    const filter = await buildContentFilter(req.query);
    const sort = buildSort(req.query.sort);
    const { page, limit, skip } = paginate(req.query);

    const [items, total] = await Promise.all([
      Content.find(filter).populate("category", "name").sort(sort).skip(skip).limit(limit),
      Content.countDocuments(filter),
    ]);

    res.json({ items, meta: buildMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
};



export const getRecommendedContent = async (req, res, next) => {
  try {
    const favoriteCategories = req.user.favoriteCategories || [];
    const limit = Math.min(48, Math.max(1, parseInt(req.query.limit, 10) || 12));

    if (favoriteCategories.length === 0) {
      return res.json({ items: [], hasFavorites: false });
    }

    const catIds = favoriteCategories.map((c) => (c._id ? c._id : c));

    const items = await Content.find({ category: { $in: catIds } })
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ items, hasFavorites: true });
  } catch (err) {
    next(err);
  }
};



export const getTrendingContent = async (req, res, next) => {
  try {
    const limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const filter = {};
    if (req.query.category) filter.category = await resolveCategoryId(req.query.category);

    const items = await Content.find(filter)
      .populate("category", "name")
      .sort({ views: -1, popularity: -1 })
      .limit(limit);

    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const getContentById = async (req, res, next) => {
  try {
    const item = await Content.findById(req.params.id).populate("category", "name").populate("tags", "name");
    if (!item) return res.status(404).json({ message: "Content not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createContent = async (req, res, next) => {
  try {
    const item = await Content.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const item = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Content not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteContent = async (req, res, next) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Content not found" });
    res.json({ message: "Content deleted" });
  } catch (err) {
    next(err);
  }
};
