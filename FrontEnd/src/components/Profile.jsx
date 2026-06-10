import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, editProfile } from "../Redux/slices/AuthSlice";
import extractPhone from "../utils/extractPhone";
import { AVATAR_COLORS } from "./DataFolder/componentsData";

/* ── SVG Icons ───────────────────────────────────────────────── */
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const GenderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="8" y1="20" x2="16" y2="20"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);
const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ── Avatar palette ──────────────────────────────────────────── */
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

/* ── Field row helper ────────────────────────────────────────── */
const Field = ({ icon, label, children }) => (
  <div style={S.fieldWrap}>
    <label style={S.label}>
      <span style={S.labelIcon}>{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

export default function Profile() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

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
    if (name === "phoneNumber") {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 10) digits = digits.slice(0, 10);
      setEditData((prev) => ({ ...prev, [name]: digits }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    setEditData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editData.name.trim()) newErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(editData.email)) newErrors.email = "Enter a valid email address";
    const phoneDigits = editData.phoneNumber.replace("+91","").replace("91","").replace(/\D/g,"");
    if (phoneDigits.length !== 10) newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    if (editData.age && (editData.age < 1 || editData.age > 120)) newErrors.age = "Enter a valid age";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const formattedPhone = extractPhone(editData.phoneNumber);
      dispatch(editProfile({ ...editData, phoneNumber: formattedPhone }));
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
      reader.onloadend = () => setEditData((prev) => ({ ...prev, profilePhoto: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const displayData = isEditing ? editData : profileData;
  const photoSrc = displayData.profilePhoto;
  const initials = (displayData.name || "?")[0].toUpperCase();
  const bgColor = avatarColor(displayData.name);

  return (
    <div style={S.page}>
      <style>{`
        .profile-input:focus { outline: 2px solid #6366f1 !important; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        .profile-input::placeholder { color: #94a3b8; }
        .edit-photo-btn:hover { background: rgba(0,0,0,0.55) !important; }
      `}</style>

      {/* ── Banner Card ─────────────────────────────────────── */}
      <div style={S.bannerCard}>
        <div style={S.banner} />
        <div style={S.bannerBody}>
          {/* Avatar */}
          <div style={S.avatarOuter}>
            {photoSrc ? (
              <img src={photoSrc} alt="Profile" style={S.avatarImg} />
            ) : (
              <div style={{ ...S.avatarInitial, background: bgColor }}>{initials}</div>
            )}
            {isEditing && (
              <label className="edit-photo-btn" style={S.photoOverlay} title="Change photo">
                <CameraIcon />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Name + role */}
          <div style={S.bannerMeta}>
            <h2 style={S.bannerName}>{displayData.name || "—"}</h2>
            <div style={S.bannerBadges}>
              <span style={user.User_Role === "Admin" ? S.badgeAdmin : S.badgeUser}>
                <ShieldIcon />
                {user.User_Role || "User"}
              </span>
              {displayData.email && (
                <span style={S.badgeEmail}>
                  <MailIcon />
                  {displayData.email}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={S.bannerActions}>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} style={S.editBtn}>
                <PencilIcon /> Edit Profile
              </button>
            ) : (
              <div style={S.btnGroup}>
                <button onClick={handleSave} style={S.saveBtn}><CheckIcon /> Save Changes</button>
                <button onClick={handleCancel} style={S.cancelBtn}><CloseIcon /> Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Personal Information Card ────────────────────────── */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={S.cardAccent} />
          <div>
            <h3 style={S.cardTitle}>Personal Information</h3>
            <p style={S.cardSubtitle}>
              {isEditing ? "Update your personal details below" : "Your personal profile information"}
            </p>
          </div>
        </div>

        <div style={S.formGrid}>
          {/* Full Name */}
          <Field icon={<UserIcon />} label="Full Name">
            {isEditing ? (
              <>
                <input
                  className="profile-input"
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  style={{ ...S.input, ...(errors.name ? S.inputError : {}) }}
                />
                {errors.name && <p style={S.errorText}>{errors.name}</p>}
              </>
            ) : (
              <p style={S.displayVal}>{profileData.name || "—"}</p>
            )}
          </Field>

          {/* Email */}
          <Field icon={<MailIcon />} label="Email Address">
            {isEditing ? (
              <>
                <input
                  className="profile-input"
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  readOnly
                  style={{ ...S.input, ...(errors.email ? S.inputError : {}), background: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }}
                />
                {errors.email && <p style={S.errorText}>{errors.email}</p>}
              </>
            ) : (
              <p style={S.displayVal}>{profileData.email || "—"}</p>
            )}
          </Field>

          {/* Phone */}
          <Field icon={<PhoneIcon />} label="Phone Number">
            {isEditing ? (
              <>
                <input
                  className="profile-input"
                  type="text"
                  name="phoneNumber"
                  value={editData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  style={{ ...S.input, ...(errors.phoneNumber ? S.inputError : {}) }}
                />
                {errors.phoneNumber && <p style={S.errorText}>{errors.phoneNumber}</p>}
              </>
            ) : (
              <p style={S.displayVal}>{profileData.phoneNumber || "—"}</p>
            )}
          </Field>

          {/* Age */}
          <Field icon={<CalendarIcon />} label="Age">
            {isEditing ? (
              <>
                <input
                  className="profile-input"
                  type="number"
                  name="age"
                  value={editData.age || ""}
                  onChange={handleInputChange}
                  placeholder="Your age"
                  style={{ ...S.input, ...(errors.age ? S.inputError : {}) }}
                />
                {errors.age && <p style={S.errorText}>{errors.age}</p>}
              </>
            ) : (
              <p style={S.displayVal}>{profileData.age || "Not specified"}</p>
            )}
          </Field>

          {/* Gender */}
          <Field icon={<GenderIcon />} label="Gender">
            {isEditing ? (
              <select
                className="profile-input"
                name="gender"
                value={editData.gender || ""}
                onChange={handleInputChange}
                style={S.input}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p style={S.displayVal}>{profileData.gender || "Not specified"}</p>
            )}
          </Field>

          {/* Address — full width */}
          <div style={S.fieldFull}>
            <Field icon={<LocationIcon />} label="Address">
              {isEditing ? (
                <textarea
                  className="profile-input"
                  name="address"
                  value={editData.address || ""}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Your delivery address"
                  style={S.textarea}
                />
              ) : (
                <p style={S.displayVal}>{profileData.address || "Not specified"}</p>
              )}
            </Field>
          </div>
        </div>
      </div>

      {/* ── Account Info Card ────────────────────────────────── */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={S.cardAccent} />
          <div>
            <h3 style={S.cardTitle}>Account Information</h3>
            <p style={S.cardSubtitle}>Read-only account details</p>
          </div>
        </div>
        <div style={S.infoGrid}>
          <div style={S.infoItem}>
            <span style={S.infoLabel}>Account ID</span>
            <span style={S.infoValue}>{user._id?.slice(-10).toUpperCase() || "—"}</span>
          </div>
          <div style={S.infoItem}>
            <span style={S.infoLabel}>Role</span>
            <span style={S.infoValue}>{user.User_Role || "User"}</span>
          </div>
          <div style={S.infoItem}>
            <span style={S.infoLabel}>Email (login)</span>
            <span style={S.infoValue}>{user.email || "—"}</span>
          </div>
          <div style={S.infoItem}>
            <span style={S.infoLabel}>Password</span>
            <span style={{ ...S.infoValue, letterSpacing: 3, color: "#94a3b8" }}>••••••••••</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "28px 24px 48px",
    fontFamily: "'Inter', system-ui, sans-serif",
    maxWidth: 860,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  /* Banner */
  bannerCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  banner: {
    height: 88,
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #818cf8 100%)",
  },
  bannerBody: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "0 28px 24px",
    flexWrap: "wrap",
  },
  avatarOuter: {
    position: "relative",
    flexShrink: 0,
    marginTop: -44,
  },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  avatarInitial: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    border: "3px solid #fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    fontWeight: 700,
    color: "#fff",
    userSelect: "none",
  },
  photoOverlay: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  bannerMeta: {
    flex: 1,
    paddingBottom: 4,
    minWidth: 0,
  },
  bannerName: {
    margin: "0 0 6px",
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
  },
  bannerBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  badgeAdmin: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 600,
    background: "#fdf2f8",
    color: "#9d174d",
    border: "1px solid #fbcfe8",
  },
  badgeUser: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 600,
    background: "#f0fdf4",
    color: "#166634",
    border: "1px solid #bbf7d0",
  },
  badgeEmail: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 500,
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
  },
  bannerActions: {
    display: "flex",
    alignItems: "center",
    paddingBottom: 4,
  },
  editBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 18px",
    borderRadius: 9,
    border: "none",
    background: "#6366f1",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(99,102,241,0.25)",
  },
  btnGroup: {
    display: "flex",
    gap: 10,
  },
  saveBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 18px",
    borderRadius: 9,
    border: "none",
    background: "#6366f1",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 18px",
    borderRadius: 9,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#475569",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },

  /* Cards */
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #f1f5f9",
    padding: "24px 28px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 22,
  },
  cardAccent: {
    display: "block",
    width: 3,
    height: 38,
    borderRadius: 99,
    background: "#6366f1",
    flexShrink: 0,
    marginTop: 2,
  },
  cardTitle: {
    margin: "0 0 3px",
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
  },
  cardSubtitle: {
    margin: 0,
    fontSize: 12,
    color: "#94a3b8",
  },

  /* Form grid */
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px 28px",
  },
  fieldFull: {
    gridColumn: "1 / -1",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  labelIcon: {
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "9px 13px",
    border: "1px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 13,
    color: "#0f172a",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  inputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239,68,68,0.1)",
  },
  textarea: {
    width: "100%",
    padding: "9px 13px",
    border: "1px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 13,
    color: "#0f172a",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  displayVal: {
    margin: 0,
    padding: "9px 13px",
    background: "#f8fafc",
    borderRadius: 9,
    border: "1px solid #f1f5f9",
    fontSize: 13,
    color: "#1e293b",
    fontWeight: 500,
  },
  errorText: {
    margin: "4px 0 0",
    fontSize: 11,
    color: "#ef4444",
    fontWeight: 500,
  },

  /* Account info grid */
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px 28px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: 500,
    color: "#334155",
    padding: "8px 12px",
    background: "#f8fafc",
    borderRadius: 8,
    border: "1px solid #f1f5f9",
  },
};
