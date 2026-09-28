import { useState, useRef } from "react";
import { Upload, Link2, X, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImageUploadInput = ({ value, onChange, label = "Item Image", placeholder = "Upload file or enter image URL" }) => {
  const [tab, setTab] = useState(value && value.startsWith("http") ? "url" : "upload");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }
    // Limit to ~8MB raw file before base64
    if (file.size > 8 * 1024 * 1024) {
      setError("File size exceeds 8MB. Please choose a smaller image.");
      return;
    }
    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target.result);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)", display: "block" }}>
          {label}
        </label>
        <div style={{ display: "flex", gap: 4, background: "var(--bg)", padding: 2, borderRadius: 8, border: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => setTab("upload")}
            style={{
              padding: "3px 8px",
              borderRadius: 6,
              border: "none",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: tab === "upload" ? "var(--primary)" : "transparent",
              color: tab === "upload" ? "#fff" : "var(--text-muted)",
              transition: "all 0.15s",
            }}
          >
            <Upload size={11} /> File Upload
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            style={{
              padding: "3px 8px",
              borderRadius: 6,
              border: "none",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: tab === "url" ? "var(--primary)" : "transparent",
              color: tab === "url" ? "#fff" : "var(--text-muted)",
              transition: "all 0.15s",
            }}
          >
            <Link2 size={11} /> Image URL
          </button>
        </div>
      </div>

      {tab === "upload" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {!value ? (
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? "var(--primary)" : "var(--border)"}`,
                borderRadius: 12,
                padding: "20px 16px",
                textAlign: "center",
                background: dragActive ? "rgba(217, 38, 169, 0.08)" : "var(--bg-soft)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  color: "#fff",
                  boxShadow: "0 6px 16px rgba(219,39,119,0.3)",
                }}
              >
                <Upload size={20} />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                {isProcessing ? "Processing image…" : "Click or drag & drop image here"}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Supports PNG, JPG, GIF, WebP & SVG up to 8MB
              </div>
            </motion.div>
          ) : (
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <img
                src={value}
                alt="Preview"
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  setError("Unable to render image from source.");
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      background: "rgba(16,185,129,0.9)",
                      color: "#fff",
                      padding: "3px 8px",
                      borderRadius: 999,
                      fontSize: 10.5,
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={11} /> Image Loaded
                  </span>
                  <button
                    type="button"
                    onClick={handleClear}
                    style={{
                      background: "rgba(239,68,68,0.85)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 26,
                      height: 26,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform 0.15s",
                    }}
                    title="Remove Image"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>
                    {value.startsWith("data:") ? "Local File Upload" : "Web Image"}
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.4)",
                      borderRadius: 6,
                      padding: "3px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Replace
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={value || ""}
              onChange={(e) => {
                setError(null);
                onChange(e.target.value);
              }}
              placeholder="https://example.com/item-photo.jpg"
              style={{
                width: "100%",
                padding: "10px 36px 10px 12px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 13.5,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  padding: 2,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {value && (
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--border)",
                height: 120,
                position: "relative",
              }}
            >
              <img
                src={value}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  setError("Unable to load preview from URL.");
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444", fontSize: 11.5, marginTop: 2 }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploadInput;
