import crypto from "crypto";



const generateRandomToken = (ttlMinutes = 60) => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + ttlMinutes * 60 * 1000);
  return { token, hashed, expires };
};

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export default generateRandomToken;
