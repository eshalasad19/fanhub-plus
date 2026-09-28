import Character from "../../models/Character.js";
import { paginate, buildMeta, resolveCategoryId, resolveContentId } from "../../utils/queryHelpers.js";

export const getCharacters = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = await resolveCategoryId(req.query.category);
    const fandomQuery = req.query.fandom || req.query.content;
    if (fandomQuery) filter.content = await resolveContentId(fandomQuery);
    if (req.query.role) filter.role = req.query.role;
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { description: { $regex: req.query.q, $options: "i" } },
      ];
    }

    const { page, limit, skip } = paginate(req.query);
    const [items, total] = await Promise.all([
      Character.find(filter).populate("category", "name").populate("content", "title").skip(skip).limit(limit),
      Character.countDocuments(filter),
    ]);

    res.json({ items, meta: buildMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
};

export const getCharacterById = async (req, res, next) => {
  try {
    const item = await Character.findById(req.params.id).populate("category", "name").populate("content", "title");
    if (!item) return res.status(404).json({ message: "Character not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createCharacter = async (req, res, next) => {
  try {
    const item = await Character.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateCharacter = async (req, res, next) => {
  try {
    const item = await Character.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Character not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteCharacter = async (req, res, next) => {
  try {
    const item = await Character.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Character not found" });
    res.json({ message: "Character deleted" });
  } catch (err) {
    next(err);
  }
};
