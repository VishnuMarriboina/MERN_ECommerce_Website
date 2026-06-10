import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  selectAuthLoading,
  selectAuthError,
  selectCurrentUser,
  handleLogin,
  forgotPassword,
} from "../Redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    User_Role: "",
    newPassword: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const user = useSelector(selectCurrentUser);

  const validateFields = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isSignup && !formData.name.trim()) {
      errors.name = "Name is required.";
    } else if (isSignup && formData.name.length > 36) {
      errors.name = "Name cannot exceed 36 characters.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!isForgotPassword && !formData.password) {
      errors.password = "Password is required.";
    } else if (!isForgotPassword && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (isSignup) {
      if (!formData.phoneNumber) {
        errors.phoneNumber = "Phone number is required.";
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = "Phone number must be 10 digits.";
      }
      if (!formData.User_Role) {
        errors.User_Role = "User Role is required.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForgotPassword = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "phoneNumber") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isForgotPassword) {
      if (!validateForgotPassword()) return;
      try {
        await dispatch(
          forgotPassword({ email: formData.email, newPassword: formData.newPassword })
        ).unwrap();
        setSuccessMessage("Password updated successfully! Please login.");
        setIsForgotPassword(false);
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          User_Role: "",
          newPassword: "",
          confirmPassword: "",
        });
        setFormErrors({});
      } catch (_) {}
      return;
    }

    if (!validateFields()) return;

    if (isSignup) {
      try {
        await dispatch(registerUser(formData)).unwrap();
        setSuccessMessage("✅ Registration successful! Please log in.");
        setIsSignup(false);
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          User_Role: "",
          newPassword: "",
          confirmPassword: "",
        });
        setFormErrors({});
      } catch (_) {}
    } else {
      try {
        await dispatch(
          handleLogin({ email: formData.email, password: formData.password })
        ).unwrap();
        navigate("/", { replace: true });
      } catch (_) {}
    }
  };

  useEffect(() => {
    if (error) setSuccessMessage("");
  }, [error]);

  return (
    <>
      {/* ✅ Scrollbar CSS inside same file */}
      <style>
        {`
          .scrollContainer {
            scrollbar-width: thin;
            scrollbar-color:  #ee9f84ff #f0f0f0; /* For Firefox */
          }

          /* Chrome, Edge, Safari */
          .scrollContainer::-webkit-scrollbar {
            width: 5px;
          }

          .scrollContainer::-webkit-scrollbar-thumb {
            background-image: linear-gradient(135deg, #ee9f84ff 0%, #ff9f6d 100%);
            border-radius: 5px;
          }

          .scrollContainer::-webkit-scrollbar-thumb:hover {
            background-image: linear-gradient(135deg,  #ee9f84ff 0%, #ff8b52 100%);
          }

          .scrollContainer::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 5px;
          }
        `}
      </style>

      <div style={styles.mainContainer}>
        <div style={styles.container}>
          <div style={styles.leftPanel}>
            <div style={styles.branding}>
              <div style={styles.brandIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={styles.iconSvg}
                >
                  <path
                    d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 style={styles.brandTitle}>
                Simplify shopping
                <br />
                with our platform.
              </h1>
              <p style={styles.brandSubtitle}>
                Discover amazing products with our user-friendly online shopping
                experience.
              </p>
              <div style={styles.illustration}>
                <div style={styles.person}>
                  <div style={styles.personHead}></div>
                  <div
                    style={{
                      ...styles.personBody,
                      background: "rgba(200, 180, 160, 0.3)",
                    }}
                  ></div>
                </div>
                <div style={styles.person}>
                  <div style={styles.personHead}></div>
                  <div
                    style={{
                      ...styles.personBody,
                      background: "rgba(255, 230, 100, 0.3)",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.rightPanel}>
            <div className="scrollContainer" style={styles.scrollContainer}>
              <div style={styles.authCard}>
                <div style={styles.authHeader}>
                  <div style={styles.authLogo}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={styles.logoSvg}
                    >
                      <path
                        d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Online Shopping</span>
                  </div>
                  <h2 style={styles.authTitle}>
                    {isForgotPassword
                      ? "Reset Password"
                      : isSignup
                      ? "Create Account"
                      : "Welcome Back"}
                  </h2>
                  <p style={styles.authSubtitle}>
                    {isForgotPassword
                      ? "Enter your email and new password"
                      : isSignup
                      ? "Sign up to start shopping"
                      : "Please login to your account"}
                  </p>
                </div>

                <form style={styles.authForm} onSubmit={handleSubmit}>
                  {isSignup && !isForgotPassword && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        maxLength={36}
                        style={styles.input}
                      />
                      {formErrors.name && (
                        <p style={styles.errorText}>{formErrors.name}</p>
                      )}
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      style={styles.input}
                    />
                    {formErrors.email && (
                      <p style={styles.errorText}>{formErrors.email}</p>
                    )}
                  </div>

                  {!isForgotPassword && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Password</label>
                      <div style={styles.passwordWrapper}>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          style={styles.input}
                        />
                        <span
                          style={styles.eyeToggle}
                          onClick={() => setShowPassword(!showPassword)}
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={styles.eyeSvg}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              style={styles.eyeSvg}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.563-4.176M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-.88M3 3l18 18"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                      {formErrors.password && (
                        <p style={styles.errorText}>{formErrors.password}</p>
                      )}
                    </div>
                  )}

                  {isForgotPassword && (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>New Password</label>
                        <div style={styles.passwordWrapper}>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            style={styles.input}
                          />
                          <span
                            style={styles.eyeToggle}
                            onClick={() => setShowPassword(!showPassword)}
                            title={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={styles.eyeSvg}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={styles.eyeSvg}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.563-4.176M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-.88M3 3l18 18"
                                />
                              </svg>
                            )}
                          </span>
                        </div>
                        {formErrors.newPassword && (
                          <p style={styles.errorText}>
                            {formErrors.newPassword}
                          </p>
                        )}
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <div style={styles.passwordWrapper}>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            style={styles.input}
                          />
                          <span
                            style={styles.eyeToggle}
                            onClick={() => setShowPassword(!showPassword)}
                            title={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={styles.eyeSvg}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={styles.eyeSvg}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.563-4.176M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-.88M3 3l18 18"
                                />
                              </svg>
                            )}
                          </span>
                        </div>
                        {formErrors.confirmPassword && (
                          <p style={styles.errorText}>
                            {formErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {isSignup && !isForgotPassword && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Enter 10-digit number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        style={styles.input}
                      />
                      {formErrors.phoneNumber && (
                        <p style={styles.errorText}>{formErrors.phoneNumber}</p>
                      )}

                      {/* ✅ User Type Dropdown */}
                      <div style={{ marginTop: 10 }}>
                        <label style={styles.label}>
                          User Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          name="User_Role"
                          value={formData.User_Role}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          required
                          style={{
                            ...styles.input,
                            cursor: "pointer",
                            backgroundColor: "#f8fafc",
                            paddingRight: "10px",
                            paddingLeft: "10px",
                          }}
                        >
                          <option value="">-- Select User Type --</option>
                          <option value="User">Customer</option>
                          <option value="Admin">Admin</option>
                        </select>

                        {formErrors.User_Role && (
                          <p style={styles.errorText}>{formErrors.User_Role}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {error && (
                    <p
                      style={{
                        ...styles.errorText,
                        textAlign: "center",
                        marginTop: "1rem",
                      }}
                    >
                      {error}
                    </p>
                  )}
                  {successMessage && (
                    <p style={{ ...styles.successText, textAlign: "center" }}>
                      {successMessage}
                    </p>
                  )}

                  {!isSignup && !isForgotPassword && (
                    <div style={styles.forgotPassword}>
                      <span
                        onClick={() => {
                          setIsSignup(false);
                          setIsForgotPassword(true);
                          setSuccessMessage("");
                          setFormErrors({});
                        }}
                        style={{ ...styles.forgotLink, cursor: "pointer" }}
                      >
                        Forgot password?
                      </span>
                    </div>
                  )}

                  {isForgotPassword && (
                    <div style={styles.forgotPassword}>
                      <span
                        onClick={() => {
                          setIsForgotPassword(false);
                          setIsSignup(false);
                          setSuccessMessage("");
                          setFormErrors({});
                          setFormData({
                            name: "",
                            email: "",
                            phoneNumber: "",
                            password: "",
                            User_Role: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        style={{ ...styles.forgotLink, cursor: "pointer" }}
                      >
                        Back to Login
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    style={styles.authBtn}
                    disabled={loading}
                  >
                    {loading
                      ? isForgotPassword
                        ? "Resetting Password..."
                        : isSignup
                        ? "Creating Account..."
                        : "Logging in..."
                      : isForgotPassword
                      ? "Reset Password"
                      : isSignup
                      ? "Sign Up"
                      : "Login"}
                  </button>
                </form>

                {!isForgotPassword && (
                  <>
                    <div style={styles.divider}>
                      <span style={styles.dividerText}>
                        Or {isSignup ? "sign up" : "login"} with
                      </span>
                    </div>

                    <div style={styles.socialButtons}>
                      <button style={styles.socialBtn}>
                        <svg
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          style={styles.socialSvg}
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </button>
                      <button style={styles.socialBtn}>
                        <svg
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          style={styles.socialSvg}
                        >
                          <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            fill="#1877F2"
                          />
                        </svg>
                        Facebook
                      </button>
                    </div>

                    <p style={styles.toggleText}>
                      {isSignup
                        ? "Already have an account?"
                        : "Don't have an account?"}{" "}
                      <span
                        style={styles.toggleLink}
                        onClick={() => {
                          setIsSignup(!isSignup);
                          setIsForgotPassword(false);
                          setSuccessMessage("");
                          setFormErrors({});
                        }}
                      >
                        {isSignup ? "Login" : "Signup"}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  mainContainer: {
    display: "flex",
    height: "100vh",
    // background: "#999b9eff",
    background: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    height: "95vh",
    // background: "#e61146ff",
    background: "white",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // padding: "2rem",
    paddingLeft: "5rem",
    paddingRight: "5rem",
    alignItems: "center",
    borderRadius: "12px 12px 12px 12px",
    justifyContent: "center",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #ff7849 0%, #ff9f6d 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    borderRadius: "35px",
    height: "85vh",
    maxHeight: "85vh",
    padding: "1.5rem",
  },
  branding: {
    maxWidth: "500px",
    color: "white",
    position: "relative",
    zIndex: 2,
  },
  brandIcon: {
    width: "60px",
    height: "60px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  iconSvg: {
    width: "32px",
    height: "32px",
    color: "white",
  },
  brandTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: "1.5rem",
    margin: 0,
  },
  brandSubtitle: {
    fontSize: "1rem",
    opacity: 0.95,
    lineHeight: 1.6,
    marginBottom: "2rem",
  },
  illustration: {
    display: "flex",
    gap: "2rem",
    marginTop: "2rem",
  },
  person: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  personHead: {
    width: "60px",
    height: "60px",
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    position: "relative",
  },

  personBody: {
    width: "80px",
    height: "100px",
    borderRadius: "20px",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    // background: "linear-gradient(135deg, #0cf1f1ff 0%, #13e293ff 100%)",
    borderRadius: "15px",
    marginLeft: "1rem",
    overflow: "hidden",
    height: "90vh",
    maxHeight: "90vh",
    // background: "#e61146ff",
    background: "white",
  },
  scrollContainer: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "1.5rem 1rem",
  },
  authCard: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    borderRadius: "12px",
    padding: "1.5rem 2rem",
    boxSizing: "border-box",
  },
  authHeader: {
    textAlign: "center",
    marginBottom: "1.2rem",
  },
  authLogo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#ff7849",
  },
  logoSvg: {
    width: "24px",
    height: "24px",
  },
  authTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "0.5rem",
    margin: 0,
  },
  authSubtitle: {
    fontSize: "0.85rem",
    color: "#64748b",
    marginTop: "0.4rem",
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    gap: "0.85rem",
  },
  formGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#334155",
    marginBottom: "0.35rem",
  },
  input: {
    width: "100%",
    padding: "0.65rem 0.75rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.85rem",
    background: "#f8fafc",
    boxSizing: "border-box",
    transition: "all 0.2s",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeToggle: {
    position: "absolute",
    right: "0.875rem",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    userSelect: "none",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
  },
  eyeSvg: {
    width: "18px",
    height: "18px",
  },
  forgotPassword: {
    textAlign: "right",
    marginTop: "-0.5rem",
  },
  forgotLink: {
    color: "#ff7849",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  authBtn: {
    background: "#ff7849",
    color: "white",
    padding: "0.875rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.8rem",
    // marginTop: "0.3rem",
  },
  successText: {
    color: "#10b981",
    fontSize: "0.85rem",
    marginTop: "1rem",
  },
  divider: {
    textAlign: "center",
    margin: "1.25rem 0",
    position: "relative",
    borderTop: "1px solid #e2e8f0",
  },
  dividerText: {
    background: "white",
    padding: "0 1rem",
    position: "relative",
    color: "#64748b",
    fontSize: "0.85rem",
    top: "-0.6rem",
  },
  socialButtons: {
    display: "flex",
    gap: "0.875rem",
    marginBottom: "1.25rem",
  },
  socialBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  socialSvg: {
    width: "18px",
    height: "18px",
  },
  toggleText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem",
  },
  toggleLink: {
    color: "#ff7849",
    fontWeight: 600,
    cursor: "pointer",
  },
};
