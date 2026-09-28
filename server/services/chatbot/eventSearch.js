import Event from "../../models/Event.js";


export const searchUpcomingEvents = async (category) => {
  const filter = { date: { $gte: new Date() } };
  if (category) {
    
    const CATEGORY_MAP = {
      "anime": "Anime",
      "gaming": "Gaming",
      "movies": "Movies",
      "tv shows": "TV Shows",
      "k-pop": "K-Pop",
      "comics": "Comics",
      "manga": "Manga",
      "cosplay": "Cosplay",
    };
    filter.category = CATEGORY_MAP[category] || (category.charAt(0).toUpperCase() + category.slice(1));
  }

  const events = await Event.find(filter).sort({ date: 1 }).limit(5);
  return events;
};


export const formatEventResults = (events, category) => {
  if (!events.length) {
    return category
      ? `I couldn't find any upcoming ${category} events right now. Check back soon!`
      : "There are no upcoming events at the moment. Check back soon!";
  }

  const label = category ? `upcoming ${category} events` : "upcoming events";
  const lines = events.map((e) => {
    const date = new Date(e.date).toLocaleDateString(undefined, { dateStyle: "medium" });
    return `• ${e.title} — ${e.venue}, ${e.city} (${date})`;
  });

  return `Here are some ${label}:\n\n${lines.join("\n")}`;
};
