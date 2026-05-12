import axios from "axios";
import { refreshAccessToken } from "./RefreshToken";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

/** ================================
 ** REQUEST INTERCEPTOR
 ** ================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");


    console.log("config in interceptor", config);
    console.log("token in interceptor", token);

    const logPayload = {
      baseURL: config.baseURL,
      path: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      requestType: config.headers["Content-Type"] || "N/A",
      token: token ? token : "No Token",

      //  token: token ? token.substring(0, 20) + "..." : "No Token",
    };

    if (config.data) logPayload.body = config.data;
    if (config.params) logPayload.queryParams = config.params;

    console.log("📤 [REQUEST SENT] →", logPayload);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ [REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

/** ============================================
 ** QUEUE MANAGEMENT FOR REFRESH TOKEN
 ** ============================================ */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  // console.log(`🔄 [QUEUE] Processing ${failedQueue.length} queued requests...`);

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
  (response) => {

    console.log("response in interceptor", response);
    const logResponse = {
      status: response.status,
      path: response.config.url,
      method: response.config.method?.toUpperCase(),
      fullURL: `${response.config.baseURL}${response.config.url}`,
      responseData:
        typeof response.data === "object"
          ? JSON.stringify(response.data)?.substring(0, 200) + "..."
          : response.data,

      res: response.data,
    };

    console.log("✅ [RESPONSE RECEIVED] ←", logResponse);

    // console.log("response in interceptor", response);

    return response;
  },

  async (error) => {
    console.log("error in api interceptor", error);
    const originalRequest = error.config;
    const status = error.response?.status;

    // ❌ Response Error Log
    console.error("❌ [RESPONSE ERROR]", {
      status,
      path: originalRequest?.url,
      fullURL: `${originalRequest?.baseURL}${originalRequest?.url}`,
      method: originalRequest?.method?.toUpperCase(),
      errorMessage: error?.response?.data || error.message,
    });

    // ✅ Handle Token Refresh for 401
    if (status === 401 && !originalRequest._retry) {
      // console.log("🔐 [AUTH] 401 detected → Refreshing token...");

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
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return Promise.reject("Refresh token failed");
        }

        // console.log("✅ [AUTH] Token refreshed successfully");

        localStorage.setItem("accessToken", newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
