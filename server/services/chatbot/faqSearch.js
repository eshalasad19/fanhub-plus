import ChatbotFaq from "../../models/ChatbotFaq.js";


export const findFaqMatch = async (message) => {
  const text = message.toLowerCase().trim();

  const faqs = await ChatbotFaq.find({ isActive: true });

  
  const keywordMatch = faqs.find((faq) =>
    faq.keywords?.some((kw) => text.includes(kw.toLowerCase()))
  );
  if (keywordMatch) return keywordMatch;

  
  const questionMatch = faqs.find((faq) => {
    const words = faq.question.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    return words.some((w) => text.includes(w));
  });

  return questionMatch || null;
};
