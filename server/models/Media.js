import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    mediaType: {
      type: String,
      required: true,
      enum: ["video", "trailer", "audio", "podcast", "soundtrack"],
    },
    url: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    duration: { type: String, default: "" },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

mediaSchema.index({ category: 1, mediaType: 1 });

export default mongoose.model("Media", mediaSchema);
