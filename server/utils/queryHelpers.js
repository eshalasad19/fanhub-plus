import Category from "../models/Category.js";
import Content from "../models/Content.js";
import Tag from "../models/Tag.js";

export const CONTENT_TYPES = ["anime", "game", "movie", "tv", "kpop", "comic", "manga", "cosplay"];

export const resolveCategoryId = async (name) => {
  if (!name) return undefined;
  const category = await Category.findOne({ name }).select("_id").lean();
  return category ? category._id : null;
};



export const resolveTagId = async (value) => {
  if (!value) return undefined;
  if (/^[0-9a-fA-F]{24}$/.test(value)) return value;
  const tag = await Tag.findOne({ name: value }).select("_id").lean();
  return tag ? tag._id : null;
};

export const resolveContentId = async (value) => {
  if (!value) return undefined;
  if (/^[0-9a-fA-F]{24}$/.test(value)) return value;
  const content = await Content.findOne({ title: new RegExp(`^${value}$`, "i") }).select("_id").lean();
  return content ? content._id : null;
};

export const buildContentFilter = async (query) => {
  const filter = {};
  if (query.category) filter.category = await resolveCategoryId(query.category);
  if (query.contentType) filter.contentType = query.contentType;
  if (query.genre) filter.genre = query.genre;
  if (query.year) filter.releaseYear = Number(query.year);
  if (query.status) filter.status = query.status;
  if (query.minPopularity) filter.popularity = { $gte: Number(query.minPopularity) };
  else if (query.popularity) filter.popularity = { $gte: Number(query.popularity) };
  if (query.tag) filter.tags = await resolveTagId(query.tag);
  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
    ];
  }
  return filter;
};

export const buildSort = (sort) => {
  switch (sort) {
    case "popular":
      return { popularity: -1 };
    case "trending":
      return { views: -1, popularity: -1 };
    case "alphabetical":
      return { title: 1 };
    case "latest":
    default:
      return { releaseYear: -1, createdAt: -1 };
  }
};

export const paginate = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 12));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.max(1, Math.ceil(total / limit)),
});
