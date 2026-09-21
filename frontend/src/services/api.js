import axios from "axios";

const api = axios.create({
  baseURL: "https://smarthealthcarebackend-dxf2huf0f5bua6da.centralindia-01.azurewebsites.net/swagger/index.html",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to every protected API request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;