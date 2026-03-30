import React from "react";

const CustomModal = ({ isOpen, title, message, onClose, type = "info" }) => {
  if (!isOpen) return null;

  const getColor = () => {
    switch (type) {
      case "success":
        return "#2ecc71"; // green
      case "error":
        return "#e74c3c"; // red
      case "warning":
        return "#f39c12"; // orange
      default:
        return "#3498db"; // blue
    }
  };

  const renderIcon = () => {
    if (type === "success") {
      return (
        <div style={iconContainerStyle}>
          <div style={{ ...circleStyle, borderColor: getColor() }}>
            <svg width="50" height="50" viewBox="0 0 50 50" style={iconStyle}>
              <path
                d="M 10 25 L 20 35 L 40 15"
                stroke={getColor()}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={checkPathStyle}
              />
            </svg>
          </div>
        </div>
      );
    } else if (type === "error") {
      return (
        <div style={iconContainerStyle}>
          <div style={{ ...circleStyle, borderColor: getColor() }}>
            <svg width="50" height="50" viewBox="0 0 50 50" style={iconStyle}>
              <path
                d="M 15 15 L 35 35 M 35 15 L 15 35"
                stroke={getColor()}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                style={crossPathStyle}
              />
            </svg>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {renderIcon()}
        <h3 style={{ ...titleStyle, color: getColor() }}>{title}</h3>
        <p style={messageStyle}>
          {message?.message || message || "Something went wrong"}
        </p>

        <button
          style={{ ...buttonStyle, backgroundColor: getColor() }}
          onClick={onClose}
        >
          OK
        </button>
      </div>
      <style>
        {`
          @keyframes pulseCircle {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }

          @keyframes drawCheck {
            0% {
              stroke-dashoffset: 50;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes drawCross {
            0% {
              stroke-dashoffset: 60;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CustomModal;

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px 25px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  width: "90%",
  maxWidth: "450px",
  minHeight: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const iconContainerStyle = {
  marginBottom: "20px",
};

const circleStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  border: "4px solid",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  animation: "pulseCircle 2s ease-in-out infinite",
};

const iconStyle = {
  display: "block",
};

const checkPathStyle = {
  strokeDasharray: 50,
  strokeDashoffset: 0,
  animation: "drawCheck 0.6s ease-in-out forwards",
};

const crossPathStyle = {
  strokeDasharray: 60,
  strokeDashoffset: 0,
  animation: "drawCross 0.5s ease-in-out forwards",
};

const titleStyle = {
  fontSize: "1.2rem",
  marginBottom: "10px",
  margin: "0 0 10px 0",
};

const messageStyle = {
  fontSize: "0.95rem",
  marginBottom: "20px",
  color: "#333",
};

const buttonStyle = {
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
  width: "100%",
};
