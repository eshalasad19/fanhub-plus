import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemType: {
      type: String,
      enum: ["Content", "Article", "Character", "Media", "Merchandise", "General"],
      default: "General",
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, default: null },
    title: { type: String, trim: true, default: "" },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

noteSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Note", noteSchema);
