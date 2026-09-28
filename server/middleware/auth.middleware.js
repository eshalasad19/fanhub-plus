import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getTokenFromHeader = (req) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.split(" ")[1];
  return null;
};



export const protect = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-passwordHash")
      .populate("favoriteCategories", "name coverImage");
    if (!user) return res.status(401).json({ message: "Not authorized, user not found" });
    if (user.isBlocked) return res.status(403).json({ message: "Your account has been blocked" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};




export const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (user && !user.isBlocked) req.user = user;
    next();
  } catch (err) {
    next();
  }
};


export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};




export const contributorOnly = (req, res, next) => {
  if (!req.user || !["user", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      message: "Only contributors can submit fan content. Convert your account to a contributor from your profile first.",
      code: "NOT_A_CONTRIBUTOR",
    });
  }
  next();
};

export default protect;
