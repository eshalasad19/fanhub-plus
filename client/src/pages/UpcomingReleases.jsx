import { useState } from "react";
import useApi from "../hooks/useApi.js";
import { CATEGORIES } from "../constants/taxonomy.js";
import SearchBar from "../components/SearchBar.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ReleaseCard from "../components/ReleaseCard.jsx";
import Pagination from "../components/Pagination.jsx";

import Breadcrumb from "../components/Breadcrumb.jsx";

const RELEASE_TYPES = [
  { value: "anime",       label: "Anime Releases" },
  { value: "game",        label: "Game Releases" },
  { value: "movie",       label: "Movie Releases" },
  { value: "tv",          label: "TV Show Releases" },
  { value: "comic",       label: "Comic Releases" },
  { value: "manga",       label: "Manga Releases" },
  { value: "merchandise", label: "Merch Drops" },
];

const UpcomingReleases = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [releaseType, setReleaseType] = useState("");
  const [page, setPage] = useState(1);
  const params = { q, category, releaseType, upcoming: "true", page, limit: 100 };
  const { data, loading } = useApi("/releases", params, [JSON.stringify(params)]);

  const selectStyle = { border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", borderRadius: 10, padding: "9px 14px", fontSize: 14, cursor: "pointer" };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Upcoming Releases" }]} />
      <h1 style={{ fontSize: 30, marginBottom: 20 }}>Upcoming Releases</h1>
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 240px", maxWidth: 360 }}>
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search upcoming releases..." />
        </div>
        <select style={selectStyle} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <select style={selectStyle} value={releaseType} onChange={(e) => { setReleaseType(e.target.value); setPage(1); }}>
          <option value="">All Release Types</option>
          {RELEASE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      {loading && <LoadingGrid count={6} height={90} />}
      {!loading && data?.items?.length === 0 && <EmptyState message="No upcoming releases scheduled." />}
      {!loading && data?.items?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {data.items.map((r) => <ReleaseCard key={r._id} release={r} />)}
        </div>
      )}
      {data?.meta && <Pagination page={data.meta.page} pages={data.meta.pages} onChange={setPage} />}
    </div>
  );
};

export default UpcomingReleases;
