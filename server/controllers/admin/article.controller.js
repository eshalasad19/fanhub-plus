import Article from "../../models/Article.js";

export const getArticles = async (req, res) => {
  try {
    const { category, published, featured, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (published !== undefined) filter.isPublished = published === "true";
    if (featured !== undefined) filter.isFeatured = featured === "true";
    if (search) filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];
    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles", error: err.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch article", error: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ message: "Failed to create article", error: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (err) {
    res.status(400).json({ message: "Failed to update article", error: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete article", error: err.message });
  }
};
