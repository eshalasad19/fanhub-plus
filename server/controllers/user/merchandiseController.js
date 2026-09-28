import mongoose from "mongoose";
import Merchandise from "../../models/Merchandise.js";

export const getMerchandise = async (req, res) => {
  try {
    const { category, tag, upcoming, search, q, limit, page, sort } = req.query;
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

    let sortObj = { createdAt: -1 };
    if (sort === "price") sortObj = { price: 1 };
    else if (sort === "-price") sortObj = { price: -1 };
    else if (sort === "-ratingAvg") sortObj = { ratingAvg: -1, ratingCount: -1 };
    else if (sort === "popular") sortObj = { views: -1, ratingAvg: -1 };
    else if (sort === "alpha") sortObj = { name: 1 };

    let query = Merchandise.find(filter).sort(sortObj);

    if (limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 20;
      const total = await Merchandise.countDocuments(filter);
      const items = await query.skip((pageNum - 1) * limitNum).limit(limitNum);
      
      // Return both formats for maximum compatibility with both arrays and { items } receivers
      return res.status(200).json({
        items,
        data: items,
        meta: { page: pageNum, pages: Math.ceil(total / limitNum) || 1, total, limit: limitNum }
      });
    }

    const merch = await query;
    res.status(200).json(merch);
  } catch (err) {
    console.error("User getMerchandise error:", err);
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
    const payload = { ...req.body };
    if (payload.image && (!payload.images || !payload.images.length)) payload.images = [payload.image];
    if (payload.images?.length && !payload.image) payload.image = payload.images[0];
    const merch = await Merchandise.create(payload);
    res.status(201).json(merch);
  } catch (err) {
    res.status(400).json({ message: "Failed to create merchandise", error: err.message });
  }
};

export const updateMerchandise = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.image && (!payload.images || !payload.images.length)) payload.images = [payload.image];
    if (payload.images?.length && !payload.image) payload.image = payload.images[0];
    const merch = await Merchandise.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!merch) return res.status(404).json({ message: "Merchandise not found" });
    res.status(200).json(merch);
  } catch (err) {
    res.status(400).json({ message: "Failed to update merchandise", error: err.message });
  }
};

export const deleteMerchandise = async (req, res) => {
  try {
    const merch = await Merchandise.findByIdAndDelete(req.params.id);
    if (!merch) return res.status(404).json({ message: "Merchandise not found" });
    res.status(200).json({ message: "Merchandise deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete merchandise", error: err.message });
  }
};
