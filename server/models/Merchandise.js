import mongoose from "mongoose";

const merchandiseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, default: "" },
    images: [{ type: String }],
    price: { type: Number, default: 0 },
    tag: { type: String, enum: ["Limited Edition", "Pre-Order", "Collectible", "New", ""], default: "" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    isUpcoming: { type: Boolean, default: false },
    externalLink: { type: String, default: "" },
    views: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

merchandiseSchema.index({ category: 1, tag: 1 });

export default mongoose.model("Merchandise", merchandiseSchema);
