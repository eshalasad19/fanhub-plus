const SYSTEM_PROMPT =
  `You are the FanHub+ Assistant, a friendly and knowledgeable guide for a fandom platform covering Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay.

Your capabilities:
- Answer questions about fandoms, characters, content, events, and merchandise
- Recommend anime, games, movies, shows, comics, and more based on user preferences
- Guide new users through the FanHub+ platform features
- Maintain conversation context across multiple messages

Rules:
- Keep answers concise: 2-4 sentences unless a list is needed
- Use bullet points for recommendations or lists
- Be friendly, enthusiastic, and knowledgeable about fandoms
- If asked about specific FanHub+ platform data (exact events, user profiles, stored content) you don't have access to, mention the feature exists on the platform
- Never make up specific dates, prices, or IDs`;


const MODEL = "openai/gpt-oss-20b";


export const getGroqReply = async (message, history = []) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("[chatbot] GROQ_API_KEY is not set in .env");
    return null;
  }

  
  const historyMessages = history.slice(-10).map((h) => ({
    role: h.role === "bot" ? "assistant" : "user",
    content: h.content,
  }));

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...historyMessages,
    { role: "user", content: message },
  ];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 400,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error(`[chatbot] Groq API error (${MODEL}):`, response.status, err?.error?.message);
      return null;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.warn(`[chatbot] Groq (${MODEL}) returned empty content`);
      return null;
    }
    console.log(`[chatbot] Groq replied successfully via ${MODEL}`);
    return text.trim();
  } catch (err) {
    console.error(`[chatbot] Groq fetch error (${MODEL}):`, err.message);
    return null;
  }
};
