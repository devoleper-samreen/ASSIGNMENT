import axios from "axios";

const api = axios.create({
  baseURL: "https://assignment-16d0.onrender.com/api", // backend ka URL
});

export default api;
