import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn, verifyLoginOTP } from "../services/auth";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState("sms"); // or "whatsapp"
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await signIn(phone);
      setOtpSent(true);
    } catch (err) {
      // Check if the error is about phone not being registered
      if (err.message && err.message.includes('غير مسجل')) {
        setError(
          <div>
            {err.message}{" "}
            <Link to="/signup" style={{ color: "#4285f4", textDecoration: "none" }}>
              إنشاء حساب جديد
            </Link>
          </div>
        );
      } else {
        setError("فشل في إرسال رمز التحقق. يرجى التحقق من رقم الهاتف.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await verifyLoginOTP(phone, otp);
      navigate("/");
    } catch (err) {
      setError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
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
      {!otpSent ? (
        <form onSubmit={handleSendOTP} dir="rtl">
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#4d5156",
              fontSize: "1rem"
            }}>
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+963XXXXXXXXX"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem"
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
              طريقة إرسال رمز التحقق
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            >
              <option value="sms">رسالة نصية (SMS)</option>
              <option value="whatsapp">واتساب</option>
            </select>
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
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} dir="rtl">
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#4d5156",
              fontSize: "1rem"
            }}>
              رمز التحقق
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="أدخل رمز التحقق المرسل إليك"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem"
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
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "جاري التحقق..." : "تحقق"}
          </button>
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "transparent",
              color: "#4285f4",
              border: "1px solid #4285f4",
              borderRadius: "4px",
              fontSize: "1rem",
              marginTop: "1rem",
              cursor: "pointer"
            }}
          >
            تغيير رقم الهاتف
          </button>
        </form>
      )}
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
            textDecoration: "none"
          }}
        >
          إنشاء حساب جديد
        </a>
      </p>
    </div>
  );
}

export default Login;
