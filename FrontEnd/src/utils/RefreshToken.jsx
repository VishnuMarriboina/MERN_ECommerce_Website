import axios from "axios";

export const refreshAccessToken = async () => {
  //console.log("🔄 [REFRESH] Attempting to refresh access token...");

  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/refresh-token",
      {},
      { withCredentials: true } // ✅ Sends HTTP-only refresh token cookie
    );

    const newAccessToken = response.data?.accessToken;

    if (newAccessToken) {
      //console.log("✅ [REFRESH] New access token received:", newAccessToken.substring(0, 20) + "...");
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    }

    console.warn("⚠️ [REFRESH] No access token in response");
    return null;
  } catch (error) {
    console.error(
      "❌ [REFRESH] Token refresh failed:",
      error.response?.data || error.message
    );
    return null;
  }
};
