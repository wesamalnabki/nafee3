import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentProfile, supabase } from "../services/auth";
import { updateProfile } from "../services/api";
import { CITIES, AREAS } from "../constants/locations";

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    date_of_birth: "",
    service_city: "",
    service_area: "",
    service_description: ""
  });
  const [availableAreas, setAvailableAreas] = useState([]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  useEffect(() => {
    // Update available areas when city changes
    if (formData.service_city) {
      setAvailableAreas(AREAS[formData.service_city] || []);
      // Reset area if it's not available in the new city
      if (!AREAS[formData.service_city]?.includes(formData.service_area)) {
        setFormData(prev => ({ ...prev, service_area: "" }));
      }
    } else {
      setAvailableAreas([]);
    }
  }, [formData.service_city]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getCurrentProfile();
      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || "",
          phone_number: profileData.phone_number || "",
          date_of_birth: profileData.date_of_birth || "",
          service_city: profileData.service_city || "",
          service_area: profileData.service_area || "",
          service_description: profileData.service_description || ""
        });
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الملف الشخصي");
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      console.log('Updating profile with data:', formData);

      // Update in backend using updateProfile
      console.log('Sending to backend:', {
        profile_id: user.id,
        ...formData
      });

      const backendResponse = await updateProfile({
        profile_id: user.id,
        ...formData
      });

      console.log('Backend response:', backendResponse);

      if (backendResponse.status === 'error') {
        throw new Error(`Backend error: ${backendResponse.message}`);
      }

      setSuccess("تم تحديث الملف الشخصي بنجاح");
      await loadProfile(); // Reload profile to get updated data
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(`حدث خطأ أثناء تحديث الملف الشخصي: ${err.message}`);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          يرجى تسجيل الدخول للوصول إلى ملفك الشخصي
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          جارٍ تحميل الملف الشخصي...
        </p>
      </div>
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
          صفحتي الشخصية
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

        {success && (
          <p style={{ 
            color: "#2ecc71", 
            marginBottom: "1rem",
            textAlign: "center"
          }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#4d5156",
              fontSize: "1rem"
            }}>
              الاسم الكامل
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
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
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              disabled
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem",
                backgroundColor: "#f5f5f5"
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
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
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
              name="service_city"
              value={formData.service_city}
              onChange={handleChange}
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
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
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
              المنطقة
            </label>
            <select
              name="service_area"
              value={formData.service_area}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            >
              <option value="">اختر المنطقة</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
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
              وصف موسع عن الخدمة
            </label>
            <textarea
              name="service_description"
              value={formData.service_description}
              onChange={handleChange}
              required
              rows="4"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem",
                resize: "vertical"
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
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
