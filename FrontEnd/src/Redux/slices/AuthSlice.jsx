import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../utils/APIKit";

const initialState = {
  loading: false,
  error: "",
  jwt: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Save user and token (if present)
    setCredentials: (state, action) => {
      state.user = action.payload.user || null;
      state.jwt = action.payload.token || "";
      state.loading = false;
      state.error = "";
    },

    // ✅ Set loading state (optional helper)
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = "";
    },
    setLoadingFalse: (state) => {
      state.loading = false;
    },

    // ✅ Set error message
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ✅ Logout clears all user data from Redux
    logout: (state) => {
      state.user = null;
      state.jwt = "";
      state.error = "";
      state.loading = false;
    },
  },
});

export const {
  setCredentials,
  setAuthError,
  logout,
  setLoading,
  setLoadingFalse,
} = authSlice.actions;

export default authSlice.reducer;

//  Register a new user

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    // console.log("userData", userData);

    const res = await axios.post(
      "http://localhost:3000/api/users/signup",
      userData
    );

    dispatch(setCredentials({ user: res.data.user }));

    // console.log("✅ Credentials set, loading should now be FALSE");
    return { success: true, user: res.data.user };
  } catch (error) {
    const msg = error.response?.data?.error || "Registration failed";

    dispatch(setAuthError(msg));
    // console.log("❌ Error set, loading should now be FALSE");

    return { success: false, error: msg };
  } finally {
    dispatch(setLoadingFalse());
  }
};

// Login.js
export const handleLogin = (email, password) => async (dispatch) => {
  // console.log("email", email, "password", password);
  try {
    dispatch(setLoading(true));
    const res = await axios.post(
      "http://localhost:3000/api/users/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // ✅ allow cookies to save
      }
    );

    localStorage.setItem("accessToken", res.data.accessToken);

    console.log("res in the handleLogin", res);
    
    dispatch(setCredentials(res.data));

    // console.log("✅ Credentials set, loading should now be FALSE");
    return { success: true };
  } catch (err) {
    dispatch(setAuthError(err.response?.data?.error || "Login failed"));
    // console.log("❌ Error set, loading should now be FALSE");
    return { success: false };
  } finally {
    dispatch(setLoadingFalse());
  }
};

// 🔹 Logout user and clear persisted store
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("activeTab");
  dispatch(logout()); // clear auth state
};

export const editProfile = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    // console.log("userData in editProfile", userData);

    const res = await api.put("/users/update-profile", userData);
    dispatch(setCredentials({ user: res.data.user }));
  } catch (error) {
    const msg = error.response?.data?.error || "Registration failed";

    dispatch(setAuthError(msg));
  } finally {
    dispatch(setLoadingFalse());
  }
};

export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/users/allUsers");
    // console.log("res in the fetchUsers", res);
    return { success: true, allUsers: res.data };
  } catch (error) {
    dispatch(setAuthError(error?.response?.data));
    // dispatch(setAuthError(error.message));
    return { success: false };
  } finally {
    dispatch(setLoadingFalse());
  }
};

export const forgotPassword = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.post("/users/forgot-password", data);
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    dispatch(setAuthError(error.response?.data?.error || error.message));

    return {
      success: false,
      message: error.response?.data?.error || "Something went wrong",
    };
  } finally {
    dispatch(setLoadingFalse());
  }
};

// ✅ Selectors

export const selectCurrentUser = (state) => state.auth.user;
export const selectJwtToken = (state) => state.auth.jwt;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
