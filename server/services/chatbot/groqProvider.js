import { SYSTEM_PROMPT } from "./systemPrompt.js";

const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

const callGroq = async (model, message, apiKey) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err?.error?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
};

export const getGroqReply = async (message) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("[chatbot] GROQ_API_KEY is not set in .env");
    return null;
  }

  for (const model of MODELS) {
    try {
      const text = await callGroq(model, message, apiKey);
      if (text) return text;
    } catch (err) {
      console.error(`[chatbot] Groq API error (${model}):`, err.status || "", err.message);
    }
  }

  return null;
};