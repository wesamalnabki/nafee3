import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#f8f9fa",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      direction: "rtl"
    }}>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1 style={{ margin: 0, color: "#2c3e50" }}>نافع - افضل الخدمات المنزلية بيد خبراء موثوقين</h1>
      </Link>
      
      <div style={{ display: "flex", gap: "1rem" }}>
        {!loading && user ? (
          <>
            <Link to="/profile">
              <button style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>صفحتي</button>
            </Link>
            <button 
              onClick={logout}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >تسجيل خروج</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>تسجيل دخول</button>
            </Link>
            <Link to="/signup">
              <button style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2ecc71",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>انضم الى نافع</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
