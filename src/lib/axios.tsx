// import axios from "axios";

// const instance = axios.create({
//   timeout: 10000,
//   withCredentials: true,
// });

// // Dynamically set baseURL for each request
// if (typeof window !== "undefined") {
//   instance.interceptors.request.use((config) => {
//     const hostname = window.location.hostname;

//     if (hostname.includes("localhost")) {
//       config.baseURL = `http://${hostname}:8000`; // Dev server
//     } else {
//       config.baseURL = `https://${hostname}/api`; // Prod
//     }

//     return config;
//   });
// }

// export default instance;



import axios from "axios";
import { useAuthStore } from "../store/authStore";

const instance = axios.create({
  timeout: 10000,
  withCredentials: true,
});

// Middleware-style import (since Zustand stores aren't reactive here)
let token: string | null = null;
if (typeof window !== "undefined") {
  const authStore = useAuthStore.getState();
  token = authStore.token;
}

if (typeof window !== "undefined") {
  instance.interceptors.request.use((config) => {
    const hostname = window.location.hostname;

    if (hostname.includes("localhost")) {
      config.baseURL = `http://${hostname}:8000`;  // dev
    } else {
      config.baseURL = `https://${hostname}/`;  // prod
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

export default instance;
