import Article from "../../models/Article.js";
import { paginate, buildMeta, resolveCategoryId, resolveContentId } from "../../utils/queryHelpers.js";

export const getArticles = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = await resolveCategoryId(req.query.category);
    const fandomQuery = req.query.fandom || req.query.content;
    if (fandomQuery) filter.content = await resolveContentId(fandomQuery);
    if (req.query.q) {
      filter.$or = [
        { title: { $regex: req.query.q, $options: "i" } },
        { body: { $regex: req.query.q, $options: "i" } },
      ];
    }

    const { page, limit, skip } = paginate(req.query);
    const [items, total] = await Promise.all([
      Article.find(filter)
        .populate("category", "name")
        .select("-body")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(filter),
    ]);

    res.json({ items, meta: buildMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const item = await Article.findById(req.params.id).populate("category", "name").populate("content", "title");
    if (!item) return res.status(404).json({ message: "Article not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const item = await Article.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const item = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Article not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const item = await Article.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    next(err);
  }
};
