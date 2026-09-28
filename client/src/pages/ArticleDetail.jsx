import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiClock } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const ArticleDetail = () => {
  const { id } = useParams();
  const { data: article, loading } = useApi(`/articles/${id}`, {}, [id]);

  if (loading) return <div className="container" style={{ paddingTop: 60 }}>Loading...</div>;
  if (!article) return <EmptyState message="Article not found." />;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 760 }}>
      <Breadcrumb
        items={[
          { label: "Articles", to: "/articles" },
          { label: article.category?.name || "Article", to: article.category?.name ? `/category/${article.category.name}` : "/articles" },
          { label: article.title },
        ]}
      />
      <Link to="/articles" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", marginBottom: 20 }}>
        <FiArrowLeft /> Back to Articles
      </Link>
      {article.coverImage && (
        <div style={{ height: 280, borderRadius: 16, marginBottom: 24, background: `url(${article.coverImage}) center/cover` }} />
      )}
      <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>{article.category?.name}</div>
      <h1 style={{ fontSize: 32, margin: "8px 0 12px" }}>{article.title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
        <FiClock size={14} /> {new Date(article.publishedAt).toLocaleDateString()}
      </div>
      <div style={{ lineHeight: 1.8, color: "var(--text)" }} dangerouslySetInnerHTML={{ __html: article.body }} />
      {article.images?.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Gallery Highlights</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {article.images.map((imgUrl, i) => (
              <img key={i} src={imgUrl} alt={`${article.title} photo ${i + 1}`}
                style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)" }} />
            ))}
          </div>
        </div>
      )}
      {article.timeline?.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Timeline & Event Highlights</h2>
          {article.timeline.map((event, i) => (
            <div key={i} className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{event.date ? new Date(event.date).toLocaleDateString() : ""}</div>
              <div style={{ fontWeight: 700, margin: "4px 0" }}>{event.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{event.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
