import axios from "axios";
import { refreshAccessToken } from "./RefreshToken";
import { store } from "../Redux/Store";
import { logoutUser } from "../Redux/slices/AuthSlice";

// Clears the persisted auth slice (not just the raw token) so ProtectedRoute
// doesn't let a stale persisted `user` back in on next load, then redirects.
const forceLogout = () => {
  store.dispatch(logoutUser());
  window.location.href = "/login";
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/** ================================
 ** REQUEST INTERCEPTOR
 ** ================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** ============================================
 ** QUEUE MANAGEMENT FOR REFRESH TOKEN
 ** ============================================ */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/** ================================
 ** RESPONSE INTERCEPTOR
 ** ================================ */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ✅ Handle Token Refresh for 401
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          forceLogout();
          return Promise.reject("Refresh token failed");
        }

        localStorage.setItem("accessToken", newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        forceLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
