import Activity from "../models/Activity.js";



export const logActivity = async ({ user, type, message, itemType = null, itemId = null }) => {
  try {
    await Activity.create({ user, type, message, itemType, itemId });
  } catch (err) {
    console.error("[activityLogger] failed to log activity:", err.message);
  }
};

export default logActivity;
