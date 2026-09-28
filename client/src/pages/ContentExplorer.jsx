import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useApi from "../hooks/useApi.js";
import SearchBar from "../components/SearchBar.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import SortDropdown from "../components/SortDropdown.jsx";
import Pagination from "../components/Pagination.jsx";
import ContentCard from "../components/ContentCard.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";

import Breadcrumb from "../components/Breadcrumb.jsx";

const ContentExplorer = ({ forcedCategory, title = "Content Explorer" }) => {
  const [filters, setFilters] = useState({
    category: forcedCategory || "",
    contentType: "",
    genre: "",
    year: "",
    minPopularity: "",
  });
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (forcedCategory !== undefined) {
      setFilters((prev) => ({ ...prev, category: forcedCategory || "" }));
      setPage(1);
    }
  }, [forcedCategory]);

  
  const params = { ...filters, q, sort, page, limit: 100 };
  const { data, loading, error } = useApi("/content", params, [JSON.stringify(params)]);

  const handleFilterChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: forcedCategory ? `${forcedCategory}` : "Explore" }]} />
      <h1 style={{ fontSize: 30, marginBottom: 20 }}>{title}</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
        <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search titles, descriptions..." />
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div style={{ marginBottom: 28 }}>
        <FilterPanel filters={filters} onChange={handleFilterChange} hideCategory={!!forcedCategory} />
      </div>

      {loading && <LoadingGrid />}
      {!loading && error && <EmptyState message="Couldn't load content right now." />}
      {!loading && !error && data?.items?.length === 0 && <EmptyState message="No matches. Try different filters." />}

      {!loading && !error && data?.items?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {data.items.map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
        </motion.div>
      )}

      {data?.meta && data.meta.pages > 1 && (
        <Pagination page={data.meta.page} pages={data.meta.pages} onChange={setPage} />
      )}
    </div>
  );
};

export default ContentExplorer;
