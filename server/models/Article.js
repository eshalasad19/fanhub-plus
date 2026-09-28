import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema(
  {
    date: { type: Date },
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    body: { type: String, required: true },
    coverImage: { type: String, default: "" },
    images: [{ type: String }],
    timeline: [timelineEventSchema],
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

articleSchema.index({ category: 1, publishedAt: -1 });

export default mongoose.model("Article", articleSchema);
