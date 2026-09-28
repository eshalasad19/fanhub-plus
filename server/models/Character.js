import mongoose from "mongoose";

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    role: { type: String, enum: ["protagonist", "antagonist", "supporting"], default: "supporting" },
  },
  { timestamps: true }
);

characterSchema.index({ category: 1, content: 1 });

export default mongoose.model("Character", characterSchema);
