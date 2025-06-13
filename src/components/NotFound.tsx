import React from "react";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        🤔 Parece que aquí no deberías haber llegado...
      </p>
      <img
        src="https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif"
        alt="Lost"
        style={{ width: "300px", maxWidth: "80vw", marginBottom: "2rem", borderRadius: "12px" }}
      />
      <button
        onClick={() => (window.location.href = "/Aspy/")}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
        Llévame a un lugar seguro
      </button>
    </div>
  );
};

export default NotFound;