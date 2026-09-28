import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const avatarFor = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=400&bold=true&format=png`;

const CharacterDetail = () => {
  const { id } = useParams();
  const { data: character, loading } = useApi(`/characters/${id}`, {}, [id]);

  if (loading) return <div className="container" style={{ paddingTop: 60 }}>Loading...</div>;
  if (!character) return <EmptyState message="Character not found." />;

  const image = character.image || avatarFor(character.name);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 700 }}>
      <Breadcrumb
        items={[
          { label: "Characters", to: "/characters" },
          { label: character.category?.name || "Profile", to: character.category?.name ? `/category/${character.category.name}` : "/characters" },
          { label: character.name },
        ]}
      />
      <Link to="/characters" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", marginBottom: 20 }}>
        <FiArrowLeft /> Back to Characters
      </Link>
      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ width: 140, height: 140, borderRadius: "50%", margin: "0 auto 18px", background: `url(${image}) center/cover` }} />
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>{character.name}</h1>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>
          {character.category?.name} {character.content?.title ? `· ${character.content.title}` : ""} · {character.role}
        </div>
        <p style={{ lineHeight: 1.7, color: "var(--text-muted)", textAlign: "left", marginBottom: 20 }}>{character.description}</p>
        {character.content?._id && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "center" }}>
            <Link to={`/content/${character.content._id}`} className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              Explore {character.content.title} Universe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetail;
