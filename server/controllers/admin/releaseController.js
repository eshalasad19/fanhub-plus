import Release from "../../models/Release.js";
import { paginate, buildMeta, resolveCategoryId } from "../../utils/queryHelpers.js";

export const getReleases = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = await resolveCategoryId(req.query.category);
    if (req.query.releaseType) filter.releaseType = req.query.releaseType;
    if (req.query.upcoming === "true") filter.releaseDate = { $gte: new Date() };
    if (req.query.q) filter.title = { $regex: req.query.q, $options: "i" };

    const { page, limit, skip } = paginate(req.query);
    const [items, total] = await Promise.all([
      Release.find(filter)
        .populate("category", "name")
        .sort({ releaseDate: 1 })
        .skip(skip)
        .limit(limit),
      Release.countDocuments(filter),
    ]);

    res.json({ items, meta: buildMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
};

export const getReleaseById = async (req, res, next) => {
  try {
    const item = await Release.findById(req.params.id).populate("category", "name");
    if (!item) return res.status(404).json({ message: "Release not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createRelease = async (req, res, next) => {
  try {
    const item = await Release.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateRelease = async (req, res, next) => {
  try {
    const item = await Release.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Release not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteRelease = async (req, res, next) => {
  try {
    const item = await Release.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Release not found" });
    res.json({ message: "Release deleted" });
  } catch (err) {
    next(err);
  }
};
