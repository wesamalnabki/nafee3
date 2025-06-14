import React, { useState } from "react";
import { signUp } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, create the user account
      const user = await signUp(email, password);
      if (!user) throw new Error("فشل في إنشاء الحساب");

      // Then, create the profile
      const profileResponse = await fetch("http://localhost:8000/add_profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone_number: phone,
          location,
          service_description: serviceDesc,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error("فشل في إنشاء الملف الشخصي");
      }

      const profileData = await profileResponse.json();
      
      if (profileData.status === 'success' && profileData.profile_id) {
        // Store the profile_id in the user's metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { profile_id: profileData.profile_id }
        });

        if (updateError) {
          console.error("Error updating user metadata:", updateError);
        }

        // Show success message and redirect to profile
        alert("تم إنشاء حسابك بنجاح!");
        navigate("/profile");
      } else {
        throw new Error(profileData.message || "فشل في إنشاء الملف الشخصي");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} dir="rtl" style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>إنشاء حساب</h2>
      
      <div style={{ marginBottom: "1rem" }}>
        <input 
          placeholder="الاسم" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input 
          placeholder="البريد الإلكتروني" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input 
          placeholder="كلمة المرور" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input 
          placeholder="رقم الهاتف" 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input 
          placeholder="الموقع" 
          value={location} 
          onChange={e => setLocation(e.target.value)} 
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <textarea 
          placeholder="وصف الخدمة" 
          value={serviceDesc} 
          onChange={e => setServiceDesc(e.target.value)} 
          required 
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", minHeight: "100px" }}
        />
      </div>

      {error && (
        <p style={{ color: "#e74c3c", marginBottom: "1rem", textAlign: "center" }}>
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
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? "جاري التسجيل..." : "سجل الآن"}
      </button>
    </form>
  );
}

export default Signup;
