import { FiInbox } from "react-icons/fi";

const EmptyState = ({ message = "Nothing to show here yet." }) => (
  <div
    style={{
      textAlign: "center",
      padding: "80px 20px",
      color: "var(--text-muted)",
    }}
  >
    <FiInbox size={40} style={{ marginBottom: 12, opacity: 0.6 }} />
    <p style={{ fontSize: 15 }}>{message}</p>
  </div>
);

export default EmptyState;
