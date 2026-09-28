import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        "Anime",
        "Gaming",
        "Movies",
        "TV Shows",
        "K-Pop",
        "Comics",
        "Manga",
        "Cosplay",
      ],
      unique: true,
    },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
