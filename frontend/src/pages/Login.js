import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "2rem auto", 
      padding: "2rem",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "2rem",
        color: "#1a0dab",
        fontSize: "1.75rem"
      }}>
        تسجيل الدخول
      </h2>
      <form onSubmit={handleSubmit} dir="rtl">
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#4d5156",
            fontSize: "1rem"
          }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #dfe1e5",
              borderRadius: "4px",
              fontSize: "1rem",
              transition: "border-color 0.2s",
              ":focus": {
                borderColor: "#4285f4",
                outline: "none"
              }
            }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#4d5156",
            fontSize: "1rem"
          }}>
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #dfe1e5",
              borderRadius: "4px",
              fontSize: "1rem",
              transition: "border-color 0.2s",
              ":focus": {
                borderColor: "#4285f4",
                outline: "none"
              }
            }}
          />
        </div>
        {error && (
          <p style={{ 
            color: "#e74c3c", 
            marginBottom: "1rem",
            textAlign: "center"
          }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background-color 0.2s",
            ":hover": {
              backgroundColor: loading ? "#4285f4" : "#3367d6"
            }
          }}
        >
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
        <p style={{ 
          textAlign: "center", 
          marginTop: "1rem",
          color: "#4d5156"
        }}>
          ليس لديك حساب؟{" "}
          <a 
            href="/signup" 
            style={{ 
              color: "#4285f4",
              textDecoration: "none",
              ":hover": {
                textDecoration: "underline"
              }
            }}
          >
            إنشاء حساب جديد
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
