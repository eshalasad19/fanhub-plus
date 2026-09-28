import { Flame, Gamepad2, Film, Tv, Music, BookOpen, Book, Crown, Sparkles } from "lucide-react";

const ICON_MAP = {
  Anime: Flame,
  Gaming: Gamepad2,
  Movies: Film,
  "TV Shows": Tv,
  "K-Pop": Music,
  Comics: BookOpen,
  Manga: Book,
  Cosplay: Crown,
};

export const CATEGORY_COLORS = {
  Anime: "#f43f5e",
  Gaming: "#06b6d4",
  Movies: "#f59e0b",
  "TV Shows": "#8b5cf6",
  "K-Pop": "#ec4899",
  Comics: "#ef4444",
  Manga: "#10b981",
  Cosplay: "#a855f7",
};

export const CATEGORY_GLOWS = {
  Anime: "rgba(244, 63, 94, 0.45)",
  Gaming: "rgba(6, 182, 212, 0.45)",
  Movies: "rgba(245, 158, 11, 0.45)",
  "TV Shows": "rgba(139, 92, 246, 0.45)",
  "K-Pop": "rgba(236, 72, 153, 0.45)",
  Comics: "rgba(239, 68, 68, 0.45)",
  Manga: "rgba(16, 185, 129, 0.45)",
  Cosplay: "rgba(168, 85, 247, 0.45)",
};

export default function CategoryIcon({ name, size = 20, color, className = "", style = {} }) {
  const IconComponent = ICON_MAP[name] || Sparkles;
  const resolvedColor = color || CATEGORY_COLORS[name] || "currentColor";
  return <IconComponent size={size} color={resolvedColor} className={className} style={style} />;
}

export { ICON_MAP };
