import { useState } from "react";
import { motion } from "framer-motion";
import { FiTag, FiX } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import ContentCard from "../components/ContentCard.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const TagsPage = () => {
  const [activeTag, setActiveTag] = useState(null);
  const { data: tags, loading: tagsLoading } = useApi("/tags");
  const { data: content, loading: contentLoading } = useApi(
    activeTag ? "/content" : null,
    { tag: activeTag, limit: 60 },
    [activeTag]
  );

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Tags" }]} />
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 28, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <FiTag /> Browse by <span className="gradient-text">Tag</span>
      </motion.h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Pick a tag to discover content across every fandom.
      </p>

      {tagsLoading ? (
        <LoadingGrid count={10} height={36} />
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
          {(tags || []).map((t) => {
            const active = activeTag === t.name;
            return (
              <button
                key={t._id}
                type="button"
                onClick={() => setActiveTag(active ? null : t.name)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: active ? "var(--gradient)" : "var(--surface)",
                  color: active ? "#fff" : "var(--text)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.name} {active && <FiX size={12} />}
              </button>
            );
          })}
          {(tags || []).length === 0 && <EmptyState message="No tags have been added yet." />}
        </div>
      )}

      {activeTag && (
        <>
          {contentLoading && <LoadingGrid />}
          {!contentLoading && (content?.items?.length || 0) === 0 && (
            <EmptyState message={`Nothing tagged "${activeTag}" yet.`} />
          )}
          {!contentLoading && content?.items?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}
            >
              {content.items.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default TagsPage;
