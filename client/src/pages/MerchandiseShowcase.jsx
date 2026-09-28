import { useState, useMemo } from "react";
import useApi from "../hooks/useApi.js";
import { CATEGORIES, MERCH_TAGS } from "../constants/taxonomy.js";
import SearchBar from "../components/SearchBar.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MerchCard from "../components/MerchCard.jsx";
import Pagination from "../components/Pagination.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const MerchandiseShowcase = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [page, setPage] = useState(1);
  const params = { q, category, tag: tagFilter, page, limit: 24 };
  const { data, loading } = useApi("/merchandise", params, [JSON.stringify(params)]);

  const items = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : (data?.items || data?.data || []);
  }, [data]);

  const selectStyle = {
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    borderRadius: 10,
    padding: "9px 14px",
    fontSize: 14,
    cursor: "pointer",
    outline: "none",
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Merchandise" }]} />
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>Merchandise Showcase</h1>
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 240px", maxWidth: 360 }}>
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search merchandise..." />
        </div>
        <select style={selectStyle} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <select style={selectStyle} value={tagFilter} onChange={(e) => { setTagFilter(e.target.value); setPage(1); }}>
          <option value="">All Tags</option>
          {MERCH_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading && <LoadingGrid count={8} height={260} />}
      {!loading && items.length === 0 && <EmptyState message="No merchandise found matching your criteria." />}
      {!loading && items.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
          {items.map((m) => <MerchCard key={m._id} item={m} />)}
        </div>
      )}
      {data?.meta && <Pagination page={data.meta.page} pages={data.meta.pages} onChange={setPage} />}
    </div>
  );
};

export default MerchandiseShowcase;
