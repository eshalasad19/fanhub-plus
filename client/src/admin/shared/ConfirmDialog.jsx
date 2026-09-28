import Modal from "./Modal.jsx";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", danger = true }) => {
  return (
    <Modal open={open} onClose={onClose} title={title} width={380}>
      <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5, margin: "0 0 22px" }}>{message}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            padding: "9px 16px",
            borderRadius: 9,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text)",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "9px 16px",
            borderRadius: 9,
            border: "none",
            background: danger ? "#ef4444" : "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            color: "#fff",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;