import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"],
      required: true,
    },
    city: { type: String, required: true },
    venue: { type: String, required: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    date: { type: Date, required: true },
    ticketLink: { type: String },
    image: { type: String },
    views: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

eventSchema.index({ city: 1, date: 1 });

export default mongoose.model("Event", eventSchema);