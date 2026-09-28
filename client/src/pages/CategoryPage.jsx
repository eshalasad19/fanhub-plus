import CategoryIcon from "../components/CategoryIcon.jsx";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiGrid, FiUsers, FiVideo, FiFileText, FiShoppingBag, FiCalendar } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import ContentExplorer from "./ContentExplorer.jsx";
import CharacterCard from "../components/CharacterCard.jsx";
import MediaCard from "../components/MediaCard.jsx";
import ArticleCard from "../components/ArticleCard.jsx";
import MerchCard from "../components/MerchCard.jsx";
import ReleaseCard from "../components/ReleaseCard.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";

import Breadcrumb from "../components/Breadcrumb.jsx";

const CATEGORY_META = {
  Anime: { desc: "Latest anime series, characters, soundtracks, and seasonal updates." },
  Gaming: { desc: "Top titles, lore, character guides, trailers, and upcoming game launches." },
  Movies: { desc: "Blockbusters, cinematic universes, trailers, reviews, and collectibles." },
  "TV Shows": { desc: "Binge-worthy shows, episode guides, teasers, and fan theories." },
  "K-Pop": { desc: "Idols, music videos, album drops, photocards, and concert highlights." },
  Comics: { desc: "Iconic superhero sagas, motion comics, comic book covers, and lore." },
  Manga: { desc: "Top serializations, author spotlights, volumes, and anime adaptation news." },
  Cosplay: { desc: "Costumes, prop crafting guides, convention galleries, and armor builds." },
};

const TABS = [
  { id: "content", label: "Explorer", icon: FiGrid },
  { id: "characters", label: "Characters", icon: FiUsers },
  { id: "media", label: "Media & Trailers", icon: FiVideo },
  { id: "articles", label: "Articles", icon: FiFileText },
  { id: "merchandise", label: "Merchandise", icon: FiShoppingBag },
  { id: "releases", label: "Releases", icon: FiCalendar },
];

const CategoryPage = () => {
  const { name } = useParams();
  const [activeTab, setActiveTab] = useState("content");

  const meta = CATEGORY_META[name] || { desc: `${name} fandom universe and curated hub.` };

  const { data: chars, loading: loadingChars } = useApi(
    activeTab === "characters" ? "/characters" : null,
    { category: name, limit: 100 },
    [activeTab, name]
  );
  const { data: media, loading: loadingMedia } = useApi(
    activeTab === "media" ? "/media" : null,
    { category: name, limit: 100 },
    [activeTab, name]
  );
  const { data: articles, loading: loadingArticles } = useApi(
    activeTab === "articles" ? "/articles" : null,
    { category: name, limit: 100 },
    [activeTab, name]
  );
  const { data: merch, loading: loadingMerch } = useApi(
    activeTab === "merchandise" ? "/merchandise" : null,
    { category: name, limit: 100 },
    [activeTab, name]
  );
  const { data: releases, loading: loadingReleases } = useApi(
    activeTab === "releases" ? "/releases" : null,
    { category: name, limit: 100 },
    [activeTab, name]
  );

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Categories", to: "/" }, { label: `${name} Hub` }]} />
      <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", marginBottom: 16 }}>
        <FiArrowLeft /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, background: "var(--gradient)", color: "white" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.15)" }}><CategoryIcon name={name} size={36} color="white" /></div>
        <div>
          <h1 style={{ fontSize: 32, margin: 0, color: "white" }}>{name} Hub</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.9, fontSize: 15 }}>{meta.desc}</p>
        </div>
      </motion.div>

      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 28, overflowX: "auto" }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 999, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 14,
              background: isActive ? "var(--primary)" : "var(--surface)",
              color: isActive ? "white" : "var(--text)",
              boxShadow: isActive ? "var(--shadow)" : "none",
              transition: "all 0.2s ease",
            }}>
              <Icon size={15} />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "content" && <ContentExplorer forcedCategory={name} title={`${name} Content Library`} />}

      {activeTab === "characters" && (
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 18 }}>{name} Characters</h2>
          {loadingChars && <LoadingGrid height={180} />}
          {!loadingChars && chars?.items?.length === 0 && <EmptyState message={`No character profiles listed for ${name} yet.`} />}
          {!loadingChars && chars?.items?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 18 }}>
              {chars.items.map((c) => <CharacterCard key={c._id} character={c} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === "media" && (
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 18 }}>{name} Videos, Trailers & Audio</h2>
          {loadingMedia && <LoadingGrid height={200} />}
          {!loadingMedia && media?.items?.length === 0 && <EmptyState message={`No media items listed for ${name} yet.`} />}
          {!loadingMedia && media?.items?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {media.items.map((m) => <MediaCard key={m._id} media={m} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === "articles" && (
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 18 }}>{name} Featured Articles</h2>
          {loadingArticles && <LoadingGrid height={220} />}
          {!loadingArticles && articles?.items?.length === 0 && <EmptyState message={`No articles published for ${name} yet.`} />}
          {!loadingArticles && articles?.items?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {articles.items.map((a) => <ArticleCard key={a._id} article={a} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === "merchandise" && (
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 18 }}>{name} Merchandise & Collectibles</h2>
          {loadingMerch && <LoadingGrid height={220} />}
          {!loadingMerch && merch?.items?.length === 0 && <EmptyState message={`No merchandise available for ${name} yet.`} />}
          {!loadingMerch && merch?.items?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {merch.items.map((m) => <MerchCard key={m._id} item={m} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === "releases" && (
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 18 }}>Upcoming {name} Releases</h2>
          {loadingReleases && <LoadingGrid count={4} height={90} />}
          {!loadingReleases && releases?.items?.length === 0 && <EmptyState message={`No upcoming releases scheduled for ${name}.`} />}
          {!loadingReleases && releases?.items?.length > 0 && (
            <div style={{ display: "grid", gap: 14 }}>
              {releases.items.map((r) => <ReleaseCard key={r._id} release={r} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
