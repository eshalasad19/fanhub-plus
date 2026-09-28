import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    targetType: { type: String, required: true, enum: ["Content", "Media", "Merchandise"] },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ratingSchema.index({ targetType: 1, targetId: 1 });

export default mongoose.model("Rating", ratingSchema);
