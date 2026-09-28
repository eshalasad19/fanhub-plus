import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client.js";

const ThemeContext = createContext();

const FONT_SCALE = { small: "14px", medium: "16px", large: "18px", "x-large": "20px" };

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("fanhub-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("fanhub-preferences");
    return saved ? JSON.parse(saved) : { fontSize: "medium", emailNotifications: true };
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fanhub-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SCALE[preferences.fontSize] || FONT_SCALE.medium;
    localStorage.setItem("fanhub-preferences", JSON.stringify(preferences));
  }, [preferences]);

  
  useEffect(() => {
    const token = localStorage.getItem("fanhub-token");
    if (!token) return;
    api
      .get("/preferences")
      .then((res) => {
        setPreferences((prev) => ({
          ...prev,
          fontSize: res.data.fontSize || prev.fontSize,
          emailNotifications: res.data.emailNotifications ?? prev.emailNotifications,
        }));
        if (res.data.theme) setTheme(res.data.theme);
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () =>
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      syncToServer({ theme: next });
      return next;
    });

  const syncToServer = (patch) => {
    const token = localStorage.getItem("fanhub-token");
    if (!token) return;
    api.put("/preferences", patch).catch(() => {});
  };

  const updatePreference = useCallback((key, value) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value };
      syncToServer({ [key]: value });
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, preferences, updatePreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export const usePreferences = () => useContext(ThemeContext);
