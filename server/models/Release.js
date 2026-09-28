import mongoose from "mongoose";

const releaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    releaseType: {
      type: String,
      required: true,
      enum: ["anime", "game", "movie", "tv", "kpop", "comic", "manga", "cosplay", "merchandise"],
    },
    releaseDate: { type: Date, required: true },
    coverImage: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

releaseSchema.index({ category: 1, releaseDate: 1 });

export default mongoose.model("Release", releaseSchema);
