import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    fontSize: { type: String, enum: ["small", "medium", "large", "x-large"], default: "medium" },
    emailNotifications: { type: Boolean, default: true },
    interestedCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

export default mongoose.model("UserPreference", userPreferenceSchema);
