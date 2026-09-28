import mongoose from "mongoose";
import Rating from "../../models/Rating.js";
import Content from "../../models/Content.js";
import Media from "../../models/Media.js";
import Merchandise from "../../models/Merchandise.js";

const MODELS = { Content, Media, Merchandise };

const recalculate = async (targetType, targetId) => {
  const objectId = mongoose.isValidObjectId(targetId) ? new mongoose.Types.ObjectId(targetId) : targetId;
  const stats = await Rating.aggregate([
    { $match: { targetType, targetId: objectId } },
    { $group: { _id: null, avg: { $avg: "$value" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  const ratingAvg = Math.round(avg * 10) / 10;
  const ratingCount = count;
  await MODELS[targetType].findByIdAndUpdate(targetId, {
    ratingAvg,
    ratingCount,
  });
  return { ratingAvg, ratingCount };
};

export const submitRating = async (req, res, next) => {
  try {
    const { targetType, targetId, value } = req.body;
    if (!MODELS[targetType]) return res.status(400).json({ message: "Invalid targetType" });

    const target = await MODELS[targetType].findById(targetId);
    if (!target) return res.status(404).json({ message: `${targetType} not found` });

    const numValue = Math.min(5, Math.max(1, Number(value) || 5));
    const rating = await Rating.create({
      targetType,
      targetId: new mongoose.Types.ObjectId(targetId),
      value: numValue,
      user: req.user._id,
    });
    const stats = await recalculate(targetType, targetId);

    res.status(201).json({ ...rating.toObject(), ...stats });
  } catch (err) {
    next(err);
  }
};

export const getRatingsForTarget = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;
    const ratings = await Rating.find({ targetType, targetId }).sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    next(err);
  }
};
