import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Search, Trash2, Eye, ShieldOff, Shield } from "lucide-react";
import PageHeader from "../shared/PageHeader.jsx";
import Badge from "../shared/Badge.jsx";
import ConfirmDialog from "../shared/ConfirmDialog.jsx";
import Modal from "../shared/Modal.jsx";

const iconBtn = (extra = {}) => ({
  width: 30, height: 30, borderRadius: 8,
  border: "1px solid var(--border)", background: "var(--bg)",
  color: "var(--text)", display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer", flexShrink: 0, ...extra,
});

const ROLE_COLORS = { admin: "#8b5cf6", user: "#10b981", visitor: "#06b6d4" };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = (q = "") => {
    setLoading(true);
    const params = q ? { search: q } : {};
    axios.get("/api/admin/users", { params }).then((r) => {
      const d = r.data; setUsers(Array.isArray(d) ? d : d?.data || d?.items || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const handleBlock = async (user) => {
    await axios.put(`/api/admin/users/${user._id}/block`);
    load(search);
  };

  const handleDelete = async () => {
    await axios.delete(`/api/admin/users/${deleteTarget._id}`);
    setDeleteTarget(null);
    load(search);
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage all registered users." />

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{ width: "100%", padding: "9px 12px 9px 32px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 13.5, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button type="submit" style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
          Search
        </button>
        {search && <button type="button" onClick={() => { setSearch(""); load(""); }} style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontSize: 13.5, cursor: "pointer" }}>Clear</button>}
      </form>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading users…</p>
      ) : users.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No users found.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 80px 80px 100px", gap: 12, padding: "10px 18px", borderBottom: "1px solid var(--border)", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)" }}>
            <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span style={{ textAlign: "right" }}>Actions</span>
          </div>
          {users.map((u, i) => (
            <motion.div key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 80px 80px 100px", gap: 12, alignItems: "center", padding: "13px 18px", borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: `${ROLE_COLORS[u.role] || "#6b7280"}1f`, color: ROLE_COLORS[u.role] || "#6b7280", textTransform: "capitalize", width: "fit-content" }}>{u.role}</span>
              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: u.isBlocked ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)", color: u.isBlocked ? "#ef4444" : "#10b981", width: "fit-content" }}>{u.isBlocked ? "Blocked" : "Active"}</span>
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                <button onClick={() => setSelected(u)} style={iconBtn()}><Eye size={13} /></button>
                <button onClick={() => handleBlock(u)} title={u.isBlocked ? "Unblock" : "Block"} style={iconBtn({ color: u.isBlocked ? "#10b981" : "#f59e0b" })}>{u.isBlocked ? <Shield size={13} /> : <ShieldOff size={13} />}</button>
                <button onClick={() => setDeleteTarget(u)} style={iconBtn({ color: "#ef4444" })}><Trash2 size={13} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="User Details" width={440}>
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {selected.avatar && <img src={selected.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />}
            <InfoRow label="Name" value={selected.name} />
            <InfoRow label="Email" value={selected.email} />
            <InfoRow label="Role" value={selected.role} />
            <InfoRow label="Status" value={selected.isBlocked ? "Blocked" : "Active"} />
            <InfoRow label="Joined" value={new Date(selected.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })} />
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete user" message={`Permanently delete "${deleteTarget?.name}"? This cannot be undone.`} />
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{value}</div>
  </div>
);

export default AdminUsers;
