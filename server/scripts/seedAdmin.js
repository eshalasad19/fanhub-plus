







import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import UserPreference from "../models/UserPreference.js";

const run = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env");
    process.exit(1);
  }
  if (ADMIN_PASSWORD.length < 6) {
    console.error("ADMIN_PASSWORD must be at least 6 characters");
    process.exit(1);
  }

  await connectDB();

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  let user = await User.findOne({ email });

  if (user) {
    user.passwordHash = passwordHash;
    user.role = "admin";
    user.isBlocked = false;
    user.isEmailVerified = true;
    if (ADMIN_NAME) user.name = ADMIN_NAME;
    await user.save();
    console.log(`Updated existing user "${email}" → role: admin`);
  } else {
    user = await User.create({
      name: ADMIN_NAME || "Admin",
      email,
      passwordHash,
      role: "admin",
      isEmailVerified: true,
    });
    await UserPreference.create({ user: user._id });
    console.log(`Created new admin user "${email}"`);
  }

  console.log("\nYou can now log in at /login with:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: (the ADMIN_PASSWORD you set in .env)`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding admin failed:", err.message);
  process.exit(1);
});
