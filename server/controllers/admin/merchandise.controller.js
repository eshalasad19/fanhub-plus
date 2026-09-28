import mongoose from "mongoose";
import Merchandise from "../../models/Merchandise.js";
import Category from "../../models/Category.js";

const normalizeMerchData = async (data) => {
  const payload = { ...data };
  
  // Normalize category: if it's a name e.g. "Anime", keep name or convert if valid ObjectId
  if (typeof payload.category === "string" && !mongoose.Types.ObjectId.isValid(payload.category)) {
    const catDoc = await Category.findOne({ name: payload.category });
    if (catDoc) {
      payload.category = catDoc.name; // Keep as string name or doc for easy frontend display
    }
  }

  // Normalize image & images
  if (payload.image && (!payload.images || !payload.images.length)) {
    payload.images = [payload.image];
  } else if (payload.images && payload.images.length && !payload.image) {
    payload.image = payload.images[0];
  }

  if (payload.price !== undefined) {
    payload.price = Number(payload.price) || 0;
  }

  return payload;
};

export const getMerchandise = async (req, res) => {
  try {
    const { category, tag, upcoming, search, q } = req.query;
    const filter = {};
    const searchVal = search || q;
    
    if (category && category !== "All" && category !== "all") {
      filter.$or = [
        { category: category },
        { "category.name": category }
      ];
    }
    if (tag && tag !== "All" && tag !== "all") filter.tag = tag;
    if (upcoming !== undefined) filter.isUpcoming = upcoming === "true";
    if (searchVal) filter.name = { $regex: searchVal, $options: "i" };

    const merch = await Merchandise.find(filter).sort({ createdAt: -1 });
    res.status(200).json(merch);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch merchandise", error: err.message });
  }
};

export const getMerchandiseById = async (req, res) => {
  try {
    const merch = await Merchandise.findById(req.params.id);
    if (!merch) return res.status(404).json({ message: "Merchandise not found" });
    res.status(200).json(merch);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch merchandise", error: err.message });
  }
};

export const createMerchandise = async (req, res) => {
  try {
    const payload = await normalizeMerchData(req.body);
    const merch = await Merchandise.create(payload);
    res.status(201).json(merch);
  } catch (err) {
    console.error("Create merchandise error:", err);
    res.status(400).json({ message: "Failed to create merchandise", error: err.message });
  }
};

export const updateMerchandise = async (req, res) => {
  try {
    const payload = await normalizeMerchData(req.body);
    const merch = await Merchandise.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!merch) return res.status(404).json({ message: "Merchandise not found" });
    res.status(200).json(merch);
  } catch (err) {
    console.error("Update merchandise error:", err);
    res.status(400).json({ message: "Failed to update merchandise", error: err.message });
  }
};

export const deleteMerchandise = async (req, res) => {
  try {
    const merch = await Merchandise.findByIdAndDelete(req.params.id);
    if (!merch) return res.status(404).json({ message: "Merchandise not found" });
    res.status(200).json({ message: "Merchandise deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete merchandise", error: err.message });
  }
};
