export const GREETING_REPLY =
  "Hey there!  I'm the FanHub+ Assistant.\n\nI can help you with:\n• Upcoming fan events & conventions\n• Anime, Gaming, Movies, K-Pop & more recommendations\n• Character info & featured articles\n• Merchandise discovery\n• Platform guidance\n\nWhat would you like to explore?";

export const HELP_REPLY =
  "Here's what I can do for you:\n\n•  **Events** — Find upcoming anime cons, gaming meetups, K-Pop shows & more\n•  **Recommendations** — Get personalised content picks for any fandom\n•  **Characters** — Ask about your favourite characters\n•  **Merchandise** — Discover fan merch, limited editions & pre-orders\n•  **FAQs** — Quick answers about the FanHub+ platform\n\nJust type your question or pick a suggestion below!";

export const FALLBACK_REPLY =
  "I'm not sure about that one! Try asking me about:\n• Upcoming events or conventions\n• Anime, Gaming, Movies, or K-Pop recommendations\n• Character info\n• FanHub+ platform features";

export const buildUnavailableReply = (feature, category) => {
  const cat = category ? ` for ${category}` : "";
  return `The ${feature} database${cat} is being connected to FanHub+ soon! In the meantime, I can help with events, FAQs, or general recommendations.`;
};
