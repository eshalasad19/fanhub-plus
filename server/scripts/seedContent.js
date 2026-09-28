





import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Content from "../models/Content.js";
import Character from "../models/Character.js";
import Article from "../models/Article.js";
import Media from "../models/Media.js";
import Merchandise from "../models/Merchandise.js";
import Release from "../models/Release.js";
import Tag from "../models/Tag.js";
import {
  contentData,
  characterData,
  articleData,
  mediaData,
  merchandiseData,
  releaseData,
} from "./seedContentData.js";

const CATEGORY_NAMES = ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];
const MERCH_TAGS = ["Limited Edition", "Pre-Order", "Collectible"];
const reset = process.argv.includes("--reset");

const seedCategories = async () => {
  const ops = CATEGORY_NAMES.map((name) => ({
    updateOne: { filter: { name }, update: { $setOnInsert: { name, description: `${name} fandom hub` } }, upsert: true },
  }));
  await Category.bulkWrite(ops);
  const categories = await Category.find();
  return Object.fromEntries(categories.map((c) => [c.name, c._id]));
};

const seedTags = async () => {
  const ops = MERCH_TAGS.map((name) => ({
    updateOne: { filter: { name }, update: { $setOnInsert: { name, type: "merch" } }, upsert: true },
  }));
  await Tag.bulkWrite(ops);
};

const withCategoryId = (items, categoryMap) => items.map((i) => ({ ...i, category: categoryMap[i.category] }));

const run = async () => {
  await connectDB();
  console.log("Connected to MongoDB for content seeding");

  if (reset) {
    await Promise.all([
      Content.deleteMany({}),
      Character.deleteMany({}),
      Article.deleteMany({}),
      Media.deleteMany({}),
      Merchandise.deleteMany({}),
      Release.deleteMany({}),
    ]);
    console.log("Cleared existing content/characters/articles/media/merchandise/releases");
  }

  const categoryMap = await seedCategories();
  await seedTags();

  const contentCount = await Content.countDocuments();
  if (contentCount > 0) {
    console.log(`Content already has ${contentCount} documents — skipping (use --reset to reseed).`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const insertedContent = await Content.insertMany(withCategoryId(contentData, categoryMap));
  const contentByTitle = Object.fromEntries(insertedContent.map((c) => [c.title, c._id]));
  const linkContent = (items) => items.map((i) => ({ ...i, content: i.content ? contentByTitle[i.content] : undefined }));

  await Character.insertMany(withCategoryId(linkContent(characterData), categoryMap));
  await Article.insertMany(withCategoryId(linkContent(articleData), categoryMap));
  await Media.insertMany(withCategoryId(linkContent(mediaData), categoryMap));
  await Merchandise.insertMany(withCategoryId(merchandiseData, categoryMap));
  await Release.insertMany(withCategoryId(releaseData, categoryMap));

  console.log("Seed complete: categories, tags, content, characters, articles, media, merchandise, releases.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Content seeding failed:", err.message);
  process.exit(1);
});
