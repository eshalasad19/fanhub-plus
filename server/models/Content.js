import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    contentType: {
      type: String,
      required: true,
      enum: ["anime", "game", "movie", "tv", "kpop", "comic", "manga", "cosplay"],
    },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    genre: [{ type: String }],
    releaseYear: { type: Number },
    status: { type: String, default: "" },
    popularity: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    watchProviders: [{ type: String }],
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contentSchema.index({ category: 1, contentType: 1 });
contentSchema.index({ title: "text", description: "text" });

export default mongoose.model("Content", contentSchema);
