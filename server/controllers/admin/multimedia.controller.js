import Media from "../../models/Media.js";

export const getMultimedia = async (req, res) => {
  try {
    const { category, type, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) filter.title = { $regex: search, $options: "i" };
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch multimedia", error: err.message });
  }
};

export const getMultimediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch media", error: err.message });
  }
};

export const createMultimedia = async (req, res) => {
  try {
    const media = await Media.create(req.body);
    res.status(201).json(media);
  } catch (err) {
    res.status(400).json({ message: "Failed to create media", error: err.message });
  }
};

export const updateMultimedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.status(200).json(media);
  } catch (err) {
    res.status(400).json({ message: "Failed to update media", error: err.message });
  }
};

export const deleteMultimedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.status(200).json({ message: "Media deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete media", error: err.message });
  }
};
