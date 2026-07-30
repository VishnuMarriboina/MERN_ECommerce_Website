import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, handleLogin, editProfile, fetchUsers, forgotPassword } from "./auth.thunk";
import { logoutUser } from "./auth.slice";

export function useAuth() {
  const dispatch = useDispatch();
  const { loading, error, jwt, user } = useSelector((s) => s.auth);

  const register = useCallback((userData) => dispatch(registerUser(userData)), [dispatch]);
  const login = useCallback((credentials) => dispatch(handleLogin(credentials)), [dispatch]);
  const updateProfile = useCallback((userData) => dispatch(editProfile(userData)), [dispatch]);
  const loadUsers = useCallback(() => dispatch(fetchUsers()), [dispatch]);
  const resetPassword = useCallback((data) => dispatch(forgotPassword(data)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  return {
    loading, error, jwt, user,
    register, login, updateProfile, loadUsers, resetPassword, logout,
  };
}
