import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSave, FiCheck, FiAlertCircle, FiLock, FiFeather, FiBarChart2, FiShield } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { usePreferences } from "../context/ThemeContext.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-soft)",
  color: "var(--text)",
  fontSize: 14,
};

const labelStyle = { fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 };

const Toast = ({ kind, text }) =>
  text ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: kind === "error" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
        color: kind === "error" ? "#ef4444" : "#22c55e",
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 13,
        marginBottom: 16,
      }}
    >
      {kind === "error" ? <FiAlertCircle /> : <FiCheck />} {text}
    </div>
  ) : null;

const Profile = () => {
  const { user, updateLocalUser, refreshUser, becomeContributor } = useAuth();
  const { data: categories } = useApi("/categories");
  const { preferences, updatePreference } = usePreferences();

  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const [profileMsg, setProfileMsg] = useState({ kind: "", text: "" });
  const [fandomMsg, setFandomMsg] = useState({ kind: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ kind: "", text: "" });
  const [contributorMsg, setContributorMsg] = useState({ kind: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingFandoms, setSavingFandoms] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [becomingContributor, setBecomingContributor] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", bio: user.bio || "", avatar: user.avatar || "" });
      setSelectedCategories((user.favoriteCategories || []).map((c) => (typeof c === "string" ? c : c._id)));
    }
  }, [user]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ kind: "", text: "" });
    try {
      const res = await api.put("/profile", form);
      updateLocalUser({ name: res.data.name, bio: res.data.bio, avatar: res.data.avatar });
      setProfileMsg({ kind: "success", text: "Profile updated!" });
    } catch (err) {
      setProfileMsg({ kind: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setSavingProfile(false);
    }
  };

  const saveFandoms = async () => {
    setSavingFandoms(true);
    setFandomMsg({ kind: "", text: "" });
    try {
      const res = await api.put("/profile/favorite-categories", { categoryIds: selectedCategories });
      updateLocalUser({ favoriteCategories: res.data.favoriteCategories });
      setFandomMsg({ kind: "success", text: "Favorite fandoms saved!" });
    } catch (err) {
      setFandomMsg({ kind: "error", text: err.response?.data?.message || "Failed to save fandoms" });
    } finally {
      setSavingFandoms(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ kind: "", text: "" });
    if (passwordForm.newPassword !== passwordForm.confirm) {
      return setPasswordMsg({ kind: "error", text: "New passwords do not match." });
    }
    setSavingPassword(true);
    try {
      await api.put("/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg({ kind: "success", text: "Password updated!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPasswordMsg({ kind: "error", text: err.response?.data?.message || "Failed to update password" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleBecomeContributor = async () => {
    setBecomingContributor(true);
    setContributorMsg({ kind: "", text: "" });
    try {
      const res = await becomeContributor();
      setContributorMsg({ kind: "success", text: res.message || "You're now a contributor!" });
    } catch (err) {
      setContributorMsg({ kind: "error", text: err.response?.data?.message || "Couldn't upgrade your account." });
    } finally {
      setBecomingContributor(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: "Profile" }]} />
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 28, marginBottom: 28 }}>
        Your <span className="gradient-text">Profile</span>
      </motion.h1>

      <div className="card" style={{ padding: 26, marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, marginBottom: 16 }}>Profile Details</h2>
        <Toast kind={profileMsg.kind} text={profileMsg.text} />
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              flexShrink: 0,
              background: form.avatar ? `url(${form.avatar}) center/cover` : "var(--gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
              color: "#fff",
            }}
          >
            {!form.avatar && (user.name?.[0]?.toUpperCase() || "?")}
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Avatar URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea
              maxLength={280}
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell other fans a bit about yourself..."
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>
          <div>
            <button type="submit" className="btn" disabled={savingProfile} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <FiSave /> {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: 26, marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <FiFeather size={16} /> Fan Content Contributor
        </h2>
        <Toast kind={contributorMsg.kind} text={contributorMsg.text} />

        {user.role === "admin" ? (
          <p style={{ color: "var(--text-muted)", fontSize: 13.5, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <FiShield color="#a855f7" /> You're an admin — you can submit and approve fan content.
          </p>
        ) : user.role === "user" ? (
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginBottom: 14 }}>
              You're an approved contributor. You can submit fan content for admin review any time.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/submit" className="btn" style={{ fontSize: 13, padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <FiFeather size={14} /> Share Fan Content
              </Link>
              <Link
                to="/analytics"
                style={{ fontSize: 13, fontWeight: 700, padding: "8px 18px", borderRadius: 999, border: "1px solid var(--border)", color: "var(--text)", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
              >
                <FiBarChart2 size={14} /> View Content Analytics
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginBottom: 14 }}>
              You're currently a visitor and can browse Fan Hub Plus, but can't add fan content yet.
              Convert your account to a contributor to submit fan art, theories, and write-ups — every
              submission is reviewed by our admins before it goes live for other fans.
            </p>
            <button className="btn" onClick={handleBecomeContributor} disabled={becomingContributor} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <FiFeather size={14} /> {becomingContributor ? "Upgrading..." : "Become a Contributor"}
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 26, marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, marginBottom: 16 }}>Favorite Fandoms</h2>
        <Toast kind={fandomMsg.kind} text={fandomMsg.text} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          {(categories || []).map((c) => {
            const active = selectedCategories.includes(c._id);
            return (
              <button
                key={c._id}
                type="button"
                onClick={() => toggleCategory(c._id)}
                style={{
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
                {c.name}
              </button>
            );
          })}
        </div>
        <button className="btn" onClick={saveFandoms} disabled={savingFandoms}>
          {savingFandoms ? "Saving..." : "Save Fandoms"}
        </button>
      </div>

      <div className="card" style={{ padding: 26, marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, marginBottom: 16 }}>Display Preferences</h2>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Font Size</label>
          <div style={{ display: "flex", gap: 10 }}>
            {["small", "medium", "large", "x-large"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updatePreference("fontSize", size)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: preferences.fontSize === size ? "var(--gradient)" : "var(--surface)",
                  color: preferences.fontSize === size ? "#fff" : "var(--text)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={(e) => updatePreference("emailNotifications", e.target.checked)}
          />
          Email me about new content in my favorite fandoms
        </label>
      </div>

      <div className="card" style={{ padding: 26 }}>
        <h2 style={{ fontSize: 17, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <FiLock size={16} /> Change Password
        </h2>
        <Toast kind={passwordMsg.kind} text={passwordMsg.text} />
        <form onSubmit={savePassword} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="password"
            placeholder="Current password"
            required
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="New password"
            required
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            required
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
            style={inputStyle}
          />
          <div>
            <button type="submit" className="btn" disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
