import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    type: { type: String, enum: ["bug", "suggestion", "query", "experience"], required: true },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    status: { type: String, enum: ["open", "reviewed", "resolved"], default: "open" },
    adminResponse: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);