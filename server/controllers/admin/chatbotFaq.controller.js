import ChatbotFaq from "../../models/ChatbotFaq.js";

export const getFaqs = async (req, res) => {
  try {
    const faqs = await ChatbotFaq.find().sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch FAQs", error: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const faq = await ChatbotFaq.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: "Failed to create FAQ", error: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const faq = await ChatbotFaq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.status(200).json(faq);
  } catch (error) {
    res.status(400).json({ message: "Failed to update FAQ", error: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const faq = await ChatbotFaq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.status(200).json({ message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete FAQ", error: error.message });
  }
};