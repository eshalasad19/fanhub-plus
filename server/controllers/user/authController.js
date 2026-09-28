import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import UserPreference from "../../models/UserPreference.js";
import generateToken from "../../utils/generateToken.js";
import generateRandomToken, { hashToken } from "../../utils/generateRandomToken.js";
import sendEmail from "../../utils/sendEmail.js";
import { logActivity } from "../../utils/activityLogger.js";

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  favoriteCategories: user.favoriteCategories,
  createdAt: user.createdAt,
});


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const { token, hashed, expires } = generateRandomToken(60 * 24); 

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      verificationToken: hashed,
      verificationTokenExpires: expires,
    });

    await UserPreference.create({ user: user._id });

    await sendEmail({
      to: user.email,
      subject: "Verify your Fan Hub Plus account",
      text: `Welcome to Fan Hub Plus! Verify your email using this token: ${token}\n\nOr visit: ${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email/${token}`,
    });

    await logActivity({ user: user._id, type: "profile_updated", message: "Account created" });

    res.status(201).json({
      message: "Account created. Please check your email to verify your account before logging in.",
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail })
      .select("+passwordHash")
      .populate("favoriteCategories", "name coverImage");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    if (user.isBlocked) return res.status(403).json({ message: "Your account has been blocked" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
        email: user.email,
      });
    }

    user.lastLoginAt = new Date();
    await user.save();
    await logActivity({ user: user._id, type: "login", message: "Logged in" });

    const token = generateToken(user._id);
    res.status(200).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};





export const logout = async (req, res) => {
  res.status(200).json({ message: "Logged out" });
};


export const getMe = async (req, res) => {
  res.status(200).json(publicUser(req.user));
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    
    const genericResponse = { message: "If that email is registered, a reset link has been sent." };
    if (!user) return res.status(200).json(genericResponse);

    const { token, hashed, expires } = generateRandomToken(60); 
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = expires;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Reset your Fan Hub Plus password",
      text: `Reset your password using this token: ${token}\n\nOr visit: ${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${token}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
    });

    res.status(200).json(genericResponse);
  } catch (err) {
    res.status(500).json({ message: "Failed to process request", error: err.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashed = hashToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) return res.status(400).json({ message: "Reset link is invalid or has expired" });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset password", error: err.message });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashed = hashToken(token);
    const user = await User.findOne({
      verificationToken: hashed,
      verificationTokenExpires: { $gt: new Date() },
    }).select("+verificationToken +verificationTokenExpires");

    if (!user) return res.status(400).json({ message: "Verification link is invalid or has expired" });

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify email", error: err.message });
  }
};


export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    const genericResponse = { message: "If that account exists and isn't verified yet, a new verification email has been sent." };
    if (!user) return res.status(200).json(genericResponse);
    if (user.isEmailVerified) return res.status(200).json(genericResponse);

    const { token, hashed, expires } = generateRandomToken(60 * 24);
    user.verificationToken = hashed;
    user.verificationTokenExpires = expires;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Verify your Fan Hub Plus account",
      text: `Verify your email using this token: ${token}\n\nOr visit: ${process.env.CLIENT_URL}/verify-email/${token}`,
    });

    res.status(200).json(genericResponse);
  } catch (err) {
    res.status(500).json({ message: "Failed to resend verification email", error: err.message });
  }
};
