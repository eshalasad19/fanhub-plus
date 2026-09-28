import mongoose from "mongoose";

const merchandiseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    images: [{ type: String }],
    price: { type: Number, default: 0 },
    tag: { type: String, default: "New" },
    tags: [{ type: mongoose.Schema.Types.Mixed }],
    isUpcoming: { type: Boolean, default: false },
    externalLink: { type: String, default: "" },
    views: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    stock: { type: Number, default: 10 },
  },
  { timestamps: true }
);

merchandiseSchema.index({ category: 1, tag: 1 });

export default mongoose.model("Merchandise", merchandiseSchema);
