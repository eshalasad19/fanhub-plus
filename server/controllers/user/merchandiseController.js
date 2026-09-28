import Merchandise from "../../models/Merchandise.js";

export const getMerchandise = async (req, res) => {
  try {
    const { category, tag, upcoming, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tag = tag;
    if (upcoming !== undefined) filter.isUpcoming = upcoming === "true";
    if (search) filter.name = { $regex: search, $options: "i" };
    const merch = await Merchandise.find(filter).populate("category", "name").sort({ createdAt: -1 });
    res.status(200).json(merch);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch merchandise", error: err.message });
  }
};

export const getMerchandiseById = async (req, res) => {
  try {
    const merch = await Merchandise.findById(req.params.id).populate("category", "name");
    if (!merch) return res.status(404).json({ message: "Merchandise not found" });
    res.status(200).json(merch);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch merchandise", error: err.message });
  }
};

export const createMerchandise = async (req, res) => {
  try {
    const merch = await Merchandise.create(req.body);
    res.status(201).json(merch);
  } catch (err) {
    res.status(400).json({ message: "Failed to create merchandise", error: err.message });
  }
};

export const updateMerchandise = async (req, res) => {
  try {
    const merch = await Merchandise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!merch) return res.status(404).json({ message: "Merchandise not found" });
    res.status(200).json(merch);
  } catch (err) {
    res.status(400).json({ message: "Failed to update merchandise", error: err.message });
  }
};

export const deleteMerchandise = async (req, res) => {
  try {
    const merch = await Merchandise.findByIdAndDelete(req.params.id);
    if (!merch) return res.status(404).json({ message: "Merchandise not found" });
    res.status(200).json({ message: "Merchandise deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete merchandise", error: err.message });
  }
};
