import { Link } from "react-router-dom";
import FlipCard from "./FlipCard.jsx";

const avatarFor = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=256&bold=true&format=png`;

const CharacterCard = ({ character }) => {
  const image = character.image || avatarFor(character.name);

  const front = (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: `url(${image}) center/cover`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", color: "white", fontWeight: 800, fontSize: 15 }}>
        {character.name}
      </div>
    </div>
  );

  const back = (
    <div
      className="card"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        background: "var(--surface)",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{character.name}</div>
      <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>
        {character.category?.name} {character.content?.title ? `· ${character.content.title}` : ""}
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {character.description}
      </p>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", marginTop: 10 }}>View Profile →</div>
    </div>
  );

  return (
    <Link to={`/characters/${character._id}`} style={{ display: "block", height: "100%" }}>
      <FlipCard front={front} back={back} height={260} />
    </Link>
  );
};

export default CharacterCard;
