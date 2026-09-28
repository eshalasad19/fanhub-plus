import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    type: { type: String, enum: ["merch", "content", "general"], default: "general" },
  },
  { timestamps: true }
);

export default mongoose.model("Tag", tagSchema);
