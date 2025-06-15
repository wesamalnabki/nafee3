import React, { useState } from "react";
import { initiateSignUp, verifyOTP } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/auth";

// List of main Syrian cities
const SYRIAN_CITIES = [
  "دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "دير الزور",
  "الرقة",
  "الحسكة",
  "القامشلي",
  "السويداء",
  "درعا",
  "إدلب",
  "ريف دمشق"
].sort(); // Sort cities alphabetically

function Signup() {
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photo, setPhoto] = useState(null);
  const [service_city, setServiceCity] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await initiateSignUp(phone, fullName, dateOfBirth, photo, service_city);
      setShowOtpInput(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verify OTP
      const { data } = await verifyOTP(phone, otp);
      
      // Show success message and redirect to profile
      alert("تم إنشاء حسابك بنجاح!");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showOtpInput) {
    return (
      <form onSubmit={handleVerification} dir="rtl" style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>التحقق من رقم الهاتف</h2>
        
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
            onChange={e => setOtp(e.target.value)} 
            required 
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
            backgroundColor: "#2ecc71",
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
      </form>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          margin: "0 0 2rem 0",
          color: "#1a0dab",
          fontSize: "2rem",
          textAlign: "center"
        }}>
          إنشاء حساب جديد
        </h1>

        {error && (
          <p style={{ 
            color: "#e74c3c", 
            marginBottom: "1rem",
            textAlign: "center"
          }}>
            {error}
          </p>
        )}

        {!showOtpInput ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#4d5156",
                fontSize: "1rem"
              }}>
                الاسم الثلاثي
              </label>
              <input 
                type="text"
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                required 
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
                تاريخ الميلاد
              </label>
              <input 
                type="date"
                value={dateOfBirth} 
                onChange={e => setDateOfBirth(e.target.value)} 
                required 
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
                المدينة
              </label>
              <select
                value={service_city}
                onChange={e => setServiceCity(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #dfe1e5",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              >
                <option value="">اختر المدينة</option>
                {SYRIAN_CITIES.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>

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
                onChange={e => setPhone(e.target.value)} 
                required
                placeholder="+966XXXXXXXXX"
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
                الصورة الشخصية
              </label>
              <input 
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #dfe1e5",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#2ecc71",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "جاري التسجيل..." : "تسجيل"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification} dir="rtl">
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
                onChange={e => setOtp(e.target.value)} 
                required 
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
                backgroundColor: "#2ecc71",
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
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
