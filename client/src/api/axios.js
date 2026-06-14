import axios from "axios";

const api = axios.create({
  baseURL: "https://circle-up-sfx3.onrender.com/api",
});

// Automatically attach token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;