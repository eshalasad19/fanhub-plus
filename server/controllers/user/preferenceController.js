import UserPreference from "../../models/UserPreference.js";


export const getPreferences = async (req, res) => {
  try {
    let prefs = await UserPreference.findOne({ user: req.user._id });
    if (!prefs) prefs = await UserPreference.create({ user: req.user._id });
    res.status(200).json(prefs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch preferences", error: err.message });
  }
};


export const updatePreferences = async (req, res) => {
  try {
    const { theme, fontSize, emailNotifications, interestedCategories } = req.body;
    const update = {};
    if (theme !== undefined) update.theme = theme;
    if (fontSize !== undefined) update.fontSize = fontSize;
    if (emailNotifications !== undefined) update.emailNotifications = emailNotifications;
    if (interestedCategories !== undefined) update.interestedCategories = interestedCategories;

    const prefs = await UserPreference.findOneAndUpdate(
      { user: req.user._id },
      update,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(prefs);
  } catch (err) {
    res.status(400).json({ message: "Failed to update preferences", error: err.message });
  }
};
