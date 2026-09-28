import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "bookmark_added",
        "bookmark_removed",
        "note_added",
        "rating_submitted",
        "profile_updated",
        "login",
      ],
    },
    itemType: { type: String, default: null },
    itemId: { type: mongoose.Schema.Types.ObjectId, default: null },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Activity", activitySchema);
