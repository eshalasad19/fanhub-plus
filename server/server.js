import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";


import adminCategoryRoutes  from "./routes/admin/categories.routes.js";
import adminEventRoutes     from "./routes/admin/events.routes.js";
import adminFeedbackRoutes  from "./routes/admin/feedback.routes.js";
import adminChatbotRoutes   from "./routes/admin/chatbot.routes.js";
import adminSubmissionRoutes from "./routes/admin/submissions.routes.js";
import adminAnalyticsRoutes from "./routes/admin/analytics.routes.js";
import adminUsersRoutes     from "./routes/admin/users.routes.js";
import adminContentRoutes   from "./routes/admin/content.routes.js";
import adminCharacterRoutes from "./routes/admin/characters.routes.js";
import adminArticleRoutes   from "./routes/admin/articles.routes.js";
import adminMultimediaRoutes from "./routes/admin/multimedia.routes.js";
import adminMerchandiseRoutes from "./routes/admin/merchandise.routes.js";
import adminTagRoutes       from "./routes/admin/tags.routes.js";
import adminReleaseRoutes   from "./routes/admin/releases.routes.js";


import authRoutes           from "./routes/user/authRoutes.js";
import profileRoutes        from "./routes/user/profileRoutes.js";
import preferenceRoutes     from "./routes/user/preferenceRoutes.js";
import bookmarkRoutes       from "./routes/user/bookmarkRoutes.js";
import noteRoutes           from "./routes/user/noteRoutes.js";
import activityRoutes       from "./routes/user/activityRoutes.js";
import userCategoryRoutes   from "./routes/user/categoryRoutes.js";
import userArticleRoutes    from "./routes/user/articleRoutes.js";
import userCharacterRoutes  from "./routes/user/characterRoutes.js";
import userContentRoutes    from "./routes/user/contentRoutes.js";
import userMediaRoutes      from "./routes/user/mediaRoutes.js";
import userMerchandiseRoutes from "./routes/user/merchandiseRoutes.js";
import userTagRoutes        from "./routes/user/tagRoutes.js";
import userRatingRoutes     from "./routes/user/ratingRoutes.js";
import userReleaseRoutes    from "./routes/user/releaseRoutes.js";
import fanContentRoutes     from "./routes/user/fanContentRoutes.js";
import communityRoutes      from "./routes/user/communityRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());


app.get("/api/health", (req, res) => res.json({ status: "ok" }));


app.use("/api/admin/categories",  adminCategoryRoutes);
app.use("/api/admin/events",      adminEventRoutes);
app.use("/api/admin/feedback",    adminFeedbackRoutes);
app.use("/api/admin/chatbot",     adminChatbotRoutes);
app.use("/api/admin/submissions", adminSubmissionRoutes);
app.use("/api/admin/analytics",   adminAnalyticsRoutes);
app.use("/api/admin/users",       adminUsersRoutes);
app.use("/api/admin/content",     adminContentRoutes);
app.use("/api/admin/characters",  adminCharacterRoutes);
app.use("/api/admin/articles",    adminArticleRoutes);
app.use("/api/admin/multimedia",  adminMultimediaRoutes);
app.use("/api/admin/merchandise", adminMerchandiseRoutes);
app.use("/api/admin/tags",        adminTagRoutes);
app.use("/api/admin/releases",    adminReleaseRoutes);


app.use("/api/auth",        authRoutes);
app.use("/api/profile",     profileRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/bookmarks",   bookmarkRoutes);
app.use("/api/notes",       noteRoutes);
app.use("/api/activities",  activityRoutes);


app.use("/api/categories",  userCategoryRoutes);
app.use("/api/articles",    userArticleRoutes);
app.use("/api/characters",  userCharacterRoutes);
app.use("/api/content",     userContentRoutes);
app.use("/api/media",       userMediaRoutes);
app.use("/api/merchandise", userMerchandiseRoutes);
app.use("/api/tags",        userTagRoutes);
app.use("/api/ratings",     userRatingRoutes);
app.use("/api/releases",    userReleaseRoutes);
app.use("/api/fan-content", fanContentRoutes);
app.use("/api/community",   communityRoutes);



app.use("/api/events",      adminEventRoutes);
app.use("/api/feedback",    adminFeedbackRoutes);
app.use("/api/chatbot",     adminChatbotRoutes);
app.use("/api/submissions", adminSubmissionRoutes);
app.use("/api/analytics",   adminAnalyticsRoutes);
app.use("/api/users",       adminUsersRoutes);


// Production: serve the built React frontend (client/dist) from this server
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Fan Hub Plus API running on port ${PORT}`));
});