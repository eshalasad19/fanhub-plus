import axios from "axios";








axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("fanhub-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("fanhub-token");
      localStorage.removeItem("fanhub-user");
    }
    return Promise.reject(err);
  }
);
