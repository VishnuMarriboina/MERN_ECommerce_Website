import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/APIKit";
import { ENDPOINTS } from "../../utils/endpoints";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post(ENDPOINTS.auth.signup, userData);
      return { user: res.data.data?.user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || "Registration failed"
      );
    }
  }
);

export const handleLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        ENDPOINTS.auth.login,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const { user, accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      return { user, token: accessToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || "Login failed"
      );
    }
  }
);

export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.put(ENDPOINTS.users.updateProfile, userData);
      return { user: res.data.data?.user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || "Profile update failed"
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(ENDPOINTS.users.all);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.response?.data || "Failed to fetch users"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(ENDPOINTS.auth.forgotPassword, data);
      return { message: res.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || "Something went wrong"
      );
    }
  }
);
