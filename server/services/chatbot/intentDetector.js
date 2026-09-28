const GREETINGS = ["hi", "hello", "hey", "howdy", "sup", "greetings", "good morning", "good afternoon", "good evening"];
const HELP_WORDS = ["what can you do", "how do you work", "commands", "options", "your features", "help me", "guide me", "how to use", "what is fanhub", "about fanhub", "platform"];

const CATEGORIES = ["anime", "gaming", "movies", "tv shows", "k-pop", "comics", "manga", "cosplay"];

const EVENT_WORDS = ["event", "events", "convention", "meetup", "con", "screening", "upcoming", "when is", "schedule", "calendar"];
const RECOMMEND_WORDS = ["recommend", "recommendation", "suggestion", "suggest", "what should i", "best", "top", "popular", "what to watch", "what to play", "what to read"];
const CONTENT_WORDS = ["watch", "read", "play", "series", "show", "game", "movie", "film", "season"];
const CHARACTER_WORDS = ["character", "characters", "who is", "villain", "hero", "protagonist", "antagonist", "main character"];
const MERCH_WORDS = ["merch", "merchandise", "buy", "shop", "figure", "poster", "shirt", "product", "collectible", "pre-order", "limited edition"];

const matchesAny = (text, words) => words.some((w) => text.includes(w));
const detectCategory = (text) => CATEGORIES.find((c) => text.includes(c)) || null;

export const detectIntent = (message) => {
  const text = message.toLowerCase().trim();

  if (matchesAny(text, GREETINGS)) return { type: "greeting", category: null };
  if (matchesAny(text, HELP_WORDS)) return { type: "help", category: null };

  const category = detectCategory(text);

  if (matchesAny(text, EVENT_WORDS)) return { type: "event_search", category };
  if (matchesAny(text, RECOMMEND_WORDS)) return { type: "recommendation", category };
  if (matchesAny(text, CHARACTER_WORDS)) return { type: "character_search", category };
  if (matchesAny(text, MERCH_WORDS)) return { type: "merchandise_search", category };
  if (matchesAny(text, CONTENT_WORDS)) return { type: "content_search", category };

  return { type: "unknown", category };
};
