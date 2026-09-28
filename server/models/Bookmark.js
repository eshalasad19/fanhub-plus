import mongoose from "mongoose";




const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemType: {
      type: String,
      required: true,
      enum: ["Content", "Article", "Character", "Media", "Merchandise"],
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Bookmark", bookmarkSchema);
