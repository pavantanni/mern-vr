import axios from "axios";

const API = axios.create({
  // ✅ You MUST include /api at the end
  baseURL: "https://onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
