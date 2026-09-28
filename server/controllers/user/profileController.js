import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { logActivity } from "../../utils/activityLogger.js";


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favoriteCategories", "name coverImage");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;
    if (avatar !== undefined) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    }).populate("favoriteCategories", "name coverImage");

    await logActivity({ user: user._id, type: "profile_updated", message: "Updated profile details" });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "Failed to update profile", error: err.message });
  }
};


export const updateFavoriteCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body;
    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ message: "categoryIds must be an array" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { favoriteCategories: categoryIds },
      { new: true, runValidators: true }
    ).populate("favoriteCategories", "name coverImage");

    await logActivity({
      user: user._id,
      type: "profile_updated",
      message: "Updated favorite fandoms",
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "Failed to update favorite fandoms", error: err.message });
  }
};





export const becomeContributor = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(200).json({ message: "Admins can already submit content.", user: req.user });
    }
    if (req.user.role === "user") {
      return res.status(200).json({ message: "You're already a contributor.", user: req.user });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: "user", contributorSince: new Date() },
      { new: true, runValidators: true }
    ).populate("favoriteCategories", "name coverImage");

    await logActivity({
      user: user._id,
      type: "profile_updated",
      message: "Became a fan content contributor",
    });

    res.status(200).json({ message: "You're now a contributor! You can submit fan content for review.", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to upgrade account", error: err.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Current and new password (min 6 chars) are required" });
    }

    const user = await User.findById(req.user._id).select("+passwordHash");
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Current password is incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
};
