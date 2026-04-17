import axios from "axios";
const API = axios.create({
  baseURL: "https://mern-vr-backend.onrender.com/",
});
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

const API = axios.create({
  baseURL: "https://onrender.com",
});

export default API;
