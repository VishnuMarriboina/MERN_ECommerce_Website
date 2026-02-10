import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../Redux/slices/AuthSlice";
import { editProfile } from "../Redux/slices/AuthSlice";
import extractPhone from "../utils/extractPhone";

export default function Profile() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const FALLBACK_PROFILE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="58" stroke="#D1D5DB" stroke-width="4" fill="#F3F4F6"/>
  <circle cx="60" cy="45" r="20" fill="#D1D5DB"/>
  <path d="M60 72C42 72 30 84 30 100H90C90 84 78 72 60 72Z" fill="#D1D5DB"/>
</svg>
`)}`;

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: extractPhone(user.phoneNumber),
    age: user.age,
    gender: user.gender,
    address: user.address,
    profilePhoto: user.profilePhoto,
  });
  const [editData, setEditData] = useState({ ...profileData });
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log("value", value);
    // ✅ Restrict phone number to 10 digits (ignore +91 for input)
    if (name === "phoneNumber") {
      // remove all non-digits
      let digits = value.replace(/\D/g, "");

      // limit to 10 digits
      if (digits.length > 10) digits = digits.slice(0, 10);

      setEditData((prev) => ({ ...prev, [name]: digits }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(editData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // console.log("phoneDigits", editData.phoneNumber);

    const phoneDigits = editData.phoneNumber
      .replace("+91", "")
      .replace("91", "")
      .replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      newErrors.phoneNumber = "Phone number must contain exactly 10 digits";
    }

    if (editData.age && (editData.age < 1 || editData.age > 120)) {
      newErrors.age = "Please enter a valid age";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      let formattedPhone = extractPhone(editData.phoneNumber);

      dispatch(
        editProfile({
          name: editData.name,
          email: editData.email,
          phoneNumber: formattedPhone,
          age: editData.age,
          gender: editData.gender,
          address: editData.address,
          profilePhoto: editData.profilePhoto,
        })
      );

      setProfileData({ ...editData, phoneNumber: formattedPhone });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setErrors({});
    setIsEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
              >
                Edit Profile
              </button>
            ) : (
              <div style={styles.buttonGroup}>
                <button onClick={handleSave} style={styles.saveButton}>
                  Save
                </button>
                <button onClick={handleCancel} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.card}>
          {/* Profile Photo Section */}
          <div style={styles.photoSection}>
            <div style={styles.photoWrapper}>
              <img
                src={
                  isEditing
                    ? editData.profilePhoto || FALLBACK_PROFILE_SVG
                    : profileData.profilePhoto || FALLBACK_PROFILE_SVG
                }
                alt="Profile"
                style={styles.profilePhoto}
              />
              {isEditing && (
                <label style={styles.cameraButton}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: 0 }}
                  >
                    <path
                      d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 21H4C2.89543 21 2 20.1046 2 19V9C2 7.89543 2.89543 7 4 7H7L9 4H15L17 7H20C21.1046 7 22 7.89543 22 9V19C22 20.1046 21.1046 21 20 21Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={styles.fileInput}
                  />
                </label>
              )}
            </div>
            <h2 style={styles.userName}>
              {isEditing ? editData.name : profileData.name}
            </h2>
          </div>

          {/* Form Fields */}
          <div style={styles.formGrid}>
            {/* Name */}
            <div style={styles.fieldWrapper}>
              <label style={styles.label}>👤 Full Name</label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.name ? styles.inputError : {}),
                    }}
                  />
                  {errors.name && <p style={styles.errorText}>{errors.name}</p>}
                </div>
              ) : (
                <p style={styles.displayValue}>{profileData.name}</p>
              )}
            </div>

            {/* Email */}

            <div style={styles.fieldWrapper}>
              <label style={styles.label}>✉ Email Address</label>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.email ? styles.inputError : {}),
                    }}
                    // editable={false}
                    readOnly
                  />
                  {errors.email && (
                    <p style={styles.errorText}>{errors.email}</p>
                  )}
                </div>
              ) : (
                <p style={styles.displayValue}>{profileData.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div style={styles.fieldWrapper}>
              <label style={styles.label}>Phone Number</label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    style={{
                      ...styles.input,
                      ...(errors.phoneNumber ? styles.inputError : {}),
                    }}
                  />
                  {errors.phoneNumber && (
                    <p style={styles.errorText}>{errors.phoneNumber}</p>
                  )}
                </div>
              ) : (
                <p style={styles.displayValue}>{profileData.phoneNumber}</p>
              )}
            </div>

            {/* Age */}
            <div style={styles.fieldWrapper}>
              <label style={styles.label}>Age</label>
              {isEditing ? (
                <div>
                  <input
                    type="number"
                    name="age"
                    value={editData.age || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    style={{
                      ...styles.input,
                      ...(errors.age ? styles.inputError : {}),
                    }}
                  />
                  {errors.age && <p style={styles.errorText}>{errors.age}</p>}
                </div>
              ) : (
                <p style={styles.displayValue}>
                  {profileData.age || "Not specified"}
                </p>
              )}
            </div>

            {/* Gender */}
            <div style={styles.fieldWrapper}>
              <label style={styles.label}>⚧ Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={editData.gender || ""}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p style={styles.displayValue}>
                  {profileData.gender || "Not specified"}
                </p>
              )}
            </div>

            {/* Address */}
            <div style={styles.fieldWrapperFull}>
              <label style={styles.label}>📍 Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={editData.address || ""}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter your address"
                  style={styles.textarea}
                />
              ) : (
                <p style={styles.displayValue}>
                  {profileData.address || "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "2rem 1rem",
  },
  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
    margin: 0,
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "0.625rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.5rem",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    padding: "0.625rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  cancelButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "#6b7280",
    color: "#ffffff",
    padding: "0.625rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: "2rem",
  },
  photoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2rem",
  },
  photoWrapper: {
    position: "relative",
  },
  profilePhoto: {
    width: "128px",
    height: "128px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #e5e7eb",
  },
  cameraButton: {
    position: "absolute",
    bottom: "0",
    right: "0",
    backgroundColor: "#e7e7e7",
    padding: "0.5rem",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "25px",
    height: "25px",
    transition: "background-color 0.2s",
    borderWidth: "2.5px",
    borderColor: "#f1f1f1ff",
    borderStyle: "solid",
  },

  fileInput: {
    display: "none",
  },
  userName: {
    marginTop: "1rem",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  fieldWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  fieldWrapperFull: {
    display: "flex",
    flexDirection: "column",
    gridColumn: "1 / -1",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.625rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textarea: {
    width: "100%",
    padding: "0.625rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  displayValue: {
    color: "#1f2937",
    padding: "0.625rem 1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    margin: 0,
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
    margin: "0.25rem 0 0 0",
  },
  accountSection: {
    marginTop: "2rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e5e7eb",
  },
  accountTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "1rem",
  },
  passwordBox: {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "1rem",
  },
  passwordText: {
    fontSize: "0.875rem",
    color: "#4b5563",
    margin: 0,
  },
  changePasswordButton: {
    marginLeft: "1rem",
    color: "#2563eb",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.875rem",
    textDecoration: "underline",
  },
};
