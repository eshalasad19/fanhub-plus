import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("fanhub-user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("fanhub-user");
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("fanhub-token"));
  const [loading, setLoading] = useState(true);

  const persist = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    try {
      if (nextToken) {
        localStorage.setItem("fanhub-token", nextToken);
        localStorage.setItem("fanhub-user", JSON.stringify(nextUser));
      } else {
        localStorage.removeItem("fanhub-token");
        localStorage.removeItem("fanhub-user");
      }
    } catch (e) {
      console.error("localStorage error:", e);
    }
  };

  
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => persist(res.data, token))
      .catch(() => persist(null, null))
      .finally(() => setLoading(false));
    
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    persist(res.data.user, res.data.token);
    return res.data.user;
  }, []);

  const resendVerification = useCallback(async (email) => {
    const res = await api.post("/auth/resend-verification", { email });
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      
    }
    persist(null, null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await api.get("/auth/me");
    persist(res.data, localStorage.getItem("fanhub-token"));
    return res.data;
  }, []);

  const becomeContributor = useCallback(async () => {
    const res = await api.post("/profile/become-contributor");
    persist(res.data.user, localStorage.getItem("fanhub-token"));
    return res.data;
  }, []);

  const updateLocalUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("fanhub-user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        resendVerification,
        refreshUser,
        becomeContributor,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
