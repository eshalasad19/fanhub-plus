import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 280 },

    favoriteCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    
    role: { type: String, enum: ["visitor", "user", "admin"], default: "visitor" },
    contributorSince: { type: Date },
    isBlocked: { type: Boolean, default: false },

    
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpires: { type: Date, select: false },

    
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
