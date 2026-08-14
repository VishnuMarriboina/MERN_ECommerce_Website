import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  handleLogin,
  editProfile,
  fetchUsers,
  forgotPassword,
} from "./auth.thunk";

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
    logout: (state) => {
      state.user = null;
      state.jwt = "";
      state.error = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.error = "";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // handleLogin
    builder
      .addCase(handleLogin.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.jwt = action.payload.token;
        state.error = "";
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // editProfile
    builder
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = "";
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchUsers — doesn't modify auth state, only loading
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // forgotPassword
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("activeTab");
  dispatch(logout());
};

export default authSlice.reducer;
