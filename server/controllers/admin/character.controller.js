import Character from "../../models/Character.js";

export const getCharacters = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { series: { $regex: search, $options: "i" } },
    ];
    const characters = await Character.find(filter).sort({ createdAt: -1 });
    res.status(200).json(characters);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch characters", error: err.message });
  }
};

export const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.status(200).json(character);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch character", error: err.message });
  }
};

export const createCharacter = async (req, res) => {
  try {
    const character = await Character.create(req.body);
    res.status(201).json(character);
  } catch (err) {
    res.status(400).json({ message: "Failed to create character", error: err.message });
  }
};

export const updateCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.status(200).json(character);
  } catch (err) {
    res.status(400).json({ message: "Failed to update character", error: err.message });
  }
};

export const deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) return res.status(404).json({ message: "Character not found" });
    res.status(200).json({ message: "Character deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete character", error: err.message });
  }
};
