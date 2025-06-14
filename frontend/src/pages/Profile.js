import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getProfile, updateProfile } from "../services/api";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.profile_id) {
      loadProfile(user.user_metadata.profile_id);
    } else if (user?.email) {
      setError("لم يتم العثور على معرف الملف الشخصي. يرجى تحديث معلومات المستخدم.");
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async (profileId) => {
    try {
      setLoading(true);
      const response = await getProfile(profileId);
      
      if (response.status === 'success' && response.profile) {
        setProfile(response.profile);
        setOriginalProfile(response.profile);
        setError(null);
        setHasChanges(false);
      } else {
        setError(response.message || "فشل في تحميل الملف الشخصي");
      }
    } catch (err) {
      setError("فشل في تحميل الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const newProfile = { ...profile, [e.target.name]: e.target.value };
    setProfile(newProfile);
    
    const hasChanges = Object.keys(newProfile).some(key => 
      newProfile[key] !== originalProfile[key]
    );
    setHasChanges(hasChanges);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(profile);
      if (res.status === 'success') {
        setSuccess("تم تحديث الملف الشخصي بنجاح");
        setError(null);
        setOriginalProfile(profile);
        setHasChanges(false);
      } else {
        setError("فشل في تحديث الملف الشخصي");
        setSuccess(null);
      }
    } catch (err) {
      setError("فشل في تحديث الملف الشخصي");
      setSuccess(null);
    }
  };
  
  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          يرجى تسجيل الدخول للوصول إلى صفحتي
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

  if (!profile) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</p>
        {user?.user_metadata?.profile_id && (
          <button
            onClick={() => loadProfile(user.user_metadata.profile_id)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            إعادة المحاولة
          </button>
        )}
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
          صفحتي
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#4d5156",
              fontSize: "1rem"
            }}>
              الاسم
            </label>
            <input
              type="text"
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
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
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              disabled
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem",
                backgroundColor: "#f8f9fa",
                color: "#666"
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
              type="text"
              name="phone_number"
              value={profile.phone_number || ""}
              onChange={handleChange}
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
              الموقع
            </label>
            <input
              type="text"
              name="location"
              value={profile.location || ""}
              onChange={handleChange}
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
              وصف الخدمة
            </label>
            <textarea
              name="service_description"
              value={profile.service_description || ""}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem",
                minHeight: "120px",
                resize: "vertical",
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

          {success && (
            <p style={{ 
              color: "#2ecc71", 
              marginBottom: "1rem",
              textAlign: "center"
            }}>
              {success}
            </p>
          )}

          {hasChanges && (
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#4285f4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.2s",
                ":hover": {
                  backgroundColor: "#3367d6"
                }
              }}
            >
              تحديث الملف الشخصي
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
