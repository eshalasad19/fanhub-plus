export const SYSTEM_PROMPT =
  "You are the FanHub+ Assistant, a friendly and helpful guide for a fandom platform covering Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay. Answer briefly and naturally in 2-3 sentences. If asked about specific FanHub+ data like exact events, content lists, or characters you don't have, say the feature is being connected soon rather than inventing details.";

const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];

const callGemini = async (model, message, apiKey) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err?.error?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getGeminiReply = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[chatbot] GEMINI_API_KEY is not set in .env");
    return null;
  }

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const text = await callGemini(model, message, apiKey);
        if (text) return text;
      } catch (err) {
        console.error(`[chatbot] Gemini API error (${model}, attempt ${attempt}):`, err.status || "", err.message);
        if (err.status === 503 && attempt === 1) {
          await wait(800);
          continue;
        }
        break;
      }
    }
  }

  return null;
};