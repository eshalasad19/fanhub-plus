import { useState } from "react";
import useApi from "../hooks/useApi.js";
import { CATEGORIES } from "../constants/taxonomy.js";
import SearchBar from "../components/SearchBar.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ArticleCard from "../components/ArticleCard.jsx";
import Pagination from "../components/Pagination.jsx";

import Breadcrumb from "../components/Breadcrumb.jsx";

const ArticleList = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const params = { q, category, page, limit: 100 };
  const { data, loading } = useApi("/articles", params, [JSON.stringify(params)]);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Articles" }]} />
      <h1 style={{ fontSize: 30, marginBottom: 20 }}>Featured Articles</h1>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        <div style={{ flex: "1 1 240px", maxWidth: 420 }}>
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search articles..." />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", borderRadius: 10, padding: "9px 14px", fontSize: 14, cursor: "pointer" }}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      {loading && <LoadingGrid height={220} />}
      {!loading && data?.items?.length === 0 && <EmptyState message="No articles yet." />}
      {!loading && data?.items?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {data.items.map((a) => <ArticleCard key={a._id} article={a} />)}
        </div>
      )}
      {data?.meta && <Pagination page={data.meta.page} pages={data.meta.pages} onChange={setPage} />}
    </div>
  );
};

export default ArticleList;
