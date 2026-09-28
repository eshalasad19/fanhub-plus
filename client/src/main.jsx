import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./api/axiosGlobalAuth.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import PageLoader from "./components/PageLoader.jsx";


const Shell = () => {
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    
    const t = setTimeout(() => setInitialLoad(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <PageLoader show={initialLoad} text="Initializing" />
      <App />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <Shell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
