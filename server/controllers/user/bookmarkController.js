import mongoose from "mongoose";
import Bookmark from "../../models/Bookmark.js";
import Content from "../../models/Content.js";
import Article from "../../models/Article.js";
import Character from "../../models/Character.js";
import Media from "../../models/Media.js";
import Merchandise from "../../models/Merchandise.js";
import { logActivity } from "../../utils/activityLogger.js";

const MODELS = { Content, Article, Character, Media, Merchandise };




const toCard = (itemType, doc) => {
  if (!doc) return null;
  const base = { _id: doc._id, itemType };
  switch (itemType) {
    case "Content":
      return { ...base, title: doc.title, image: doc.coverImage, subtitle: doc.contentType, link: `/content/${doc._id}` };
    case "Article":
      return { ...base, title: doc.title, image: doc.coverImage, subtitle: "Article", link: `/articles/${doc._id}` };
    case "Character":
      return { ...base, title: doc.name, image: doc.image, subtitle: "Character", link: `/characters/${doc._id}` };
    case "Media":
      return { ...base, title: doc.title, image: doc.thumbnail, subtitle: doc.mediaType, link: `/multimedia` };
    case "Merchandise":
      return { ...base, title: doc.name, image: doc.images?.[0], subtitle: "Merchandise", link: `/merchandise/${doc._id}` };
    default:
      return base;
  }
};


export const getBookmarks = async (req, res) => {
  try {
    const { itemType } = req.query;
    const filter = { user: req.user._id };
    if (itemType) filter.itemType = itemType;

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 }).lean();

    const resolved = await Promise.all(
      bookmarks.map(async (b) => {
        const Model = MODELS[b.itemType];
        if (!Model) return null;
        const doc = await Model.findById(b.itemId).lean();
        if (!doc) return null; 
        return { bookmarkId: b._id, createdAt: b.createdAt, item: toCard(b.itemType, doc) };
      })
    );

    res.status(200).json(resolved.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookmarks", error: err.message });
  }
};


export const checkBookmark = async (req, res) => {
  try {
    const { itemType, itemId } = req.query;
    if (!itemType || !itemId) return res.status(400).json({ message: "itemType and itemId are required" });
    const bookmark = await Bookmark.findOne({ user: req.user._id, itemType, itemId });
    res.status(200).json({ bookmarked: !!bookmark, bookmarkId: bookmark?._id || null });
  } catch (err) {
    res.status(500).json({ message: "Failed to check bookmark", error: err.message });
  }
};


export const addBookmark = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    if (!itemType || !MODELS[itemType]) return res.status(400).json({ message: "Invalid itemType" });
    if (!mongoose.isValidObjectId(itemId)) return res.status(400).json({ message: "Invalid itemId" });

    const exists = await MODELS[itemType].exists({ _id: itemId });
    if (!exists) return res.status(404).json({ message: `${itemType} not found` });

    const bookmark = await Bookmark.findOneAndUpdate(
      { user: req.user._id, itemType, itemId },
      { user: req.user._id, itemType, itemId },
      { upsert: true, new: true }
    );

    await logActivity({
      user: req.user._id,
      type: "bookmark_added",
      itemType,
      itemId,
      message: `Bookmarked a ${itemType.toLowerCase()}`,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    if (err.code === 11000) return res.status(200).json({ message: "Already bookmarked" });
    res.status(500).json({ message: "Failed to add bookmark", error: err.message });
  }
};


export const removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!bookmark) return res.status(404).json({ message: "Bookmark not found" });

    await logActivity({
      user: req.user._id,
      type: "bookmark_removed",
      itemType: bookmark.itemType,
      itemId: bookmark.itemId,
      message: `Removed a bookmarked ${bookmark.itemType.toLowerCase()}`,
    });

    res.status(200).json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove bookmark", error: err.message });
  }
};


export const removeBookmarkByItem = async (req, res) => {
  try {
    const { itemType, itemId } = req.query;
    const bookmark = await Bookmark.findOneAndDelete({ user: req.user._id, itemType, itemId });
    if (!bookmark) return res.status(404).json({ message: "Bookmark not found" });
    res.status(200).json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove bookmark", error: err.message });
  }
};
