import Category from "../../models/Category.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const seedCategories = async (req, res, next) => {
  try {
    const names = [
      "Anime", "Gaming", "Movies", "TV Shows",
      "K-Pop", "Comics", "Manga", "Cosplay",
    ];
    const ops = names.map((name) => ({
      updateOne: {
        filter: { name },
        update: { $setOnInsert: { name, description: `${name} fandom hub` } },
        upsert: true,
      },
    }));
    await Category.bulkWrite(ops);
    const categories = await Category.find().sort({ name: 1 });
    res.json({ message: "Categories seeded", categories });
  } catch (err) {
    next(err);
  }
};
