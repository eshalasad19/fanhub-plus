import { getGroqReply } from "./groqProvider.js";

export const getAiReply = async (message, history = []) => {
  return getGroqReply(message, history);
};
