const INITIAL_QUESTIONS = [
  "What is FanHub+?",
  "Show upcoming events ",
  "Recommend me an anime",
  "What K-Pop events are coming?",
  "Find gaming merchandise",
  "Guide me through the platform",
];

const getContextualSuggestions = (lastBotText) => {
  if (!lastBotText) return INITIAL_QUESTIONS;
  const text = lastBotText.toLowerCase();
  if (text.includes("anime")) return ["Recommend an anime", "Popular anime characters", "Upcoming anime events", "Anime merchandise"];
  if (text.includes("gaming") || text.includes("game")) return ["Best games this year", "Gaming events", "Gaming merchandise", "Popular gaming characters"];
  if (text.includes("k-pop")) return ["K-Pop events near me", "Popular K-Pop groups", "K-Pop merchandise", "Best K-Pop songs"];
  if (text.includes("event") || text.includes("convention")) return ["Show all events", "Anime conventions", "Cosplay meetups", "Gaming events"];
  if (text.includes("merch") || text.includes("merchandise")) return ["Anime merchandise", "Gaming merchandise", "Limited edition items", "Pre-order items"];
  if (text.includes("movie") || text.includes("film")) return ["Popular movies", "Upcoming movie releases", "Movie events", "Best sci-fi movies"];
  if (text.includes("comic") || text.includes("manga")) return ["Popular manga series", "Comic conventions", "Best manga to read", "Marvel vs DC"];
  return INITIAL_QUESTIONS;
};

const SuggestedQuestions = ({ onSelect, lastBotText }) => {
  const questions = getContextualSuggestions(lastBotText);
  return (
    <div className="chatbot-suggestions">
      {questions.map((q) => (
        <button key={q} onClick={() => onSelect(q)} className="chatbot-suggestion-chip">
          {q}
        </button>
      ))}
    </div>
  );
};

export default SuggestedQuestions;