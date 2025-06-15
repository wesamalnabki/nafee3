import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";

function WorkerProfile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('WorkerProfile received profileId:', profileId);
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      console.log('Loading profile with ID:', profileId);
      const response = await getProfile(profileId);
      console.log('Profile response:', response);
      
      if (response.status === 'success' && response.profile) {
        setProfile(response.profile);
        setError(null);
      } else {
        setError(response.message || "فشل في تحميل الملف الشخصي");
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError("فشل في تحميل الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>جارٍ تحميل الملف الشخصي...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "red" }}>{error || "لم يتم العثور على الملف الشخصي"}</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          العودة للنتائج
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "2rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        العودة للنتائج
      </button>

      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          margin: "0 0 1.5rem 0",
          color: "#1a0dab",
          fontSize: "2rem"
        }}>
          {profile.full_name}
        </h1>

        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ 
            color: "#4d5156",
            fontSize: "1.2rem",
            marginBottom: "0.5rem"
          }}>
            وصف الخدمة
          </h2>
          <p style={{ 
            color: "#4d5156",
            lineHeight: "1.6",
            fontSize: "1.1rem"
          }}>
            {profile.service_description || "لا يوجد وصف للخدمة"}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          {profile.service_city && (
            <div>
              <h3 style={{ 
                color: "#666",
                fontSize: "1rem",
                marginBottom: "0.5rem"
              }}>
                الموقع
              </h3>
              <p style={{ 
                color: "#4d5156",
                fontSize: "1.1rem"
              }}>
                📍 {profile.service_city} {profile.service_area ? `- ${profile.service_area}` : ''}
              </p>
            </div>
          )}

          {profile.phone_number && (
            <div>
              <h3 style={{ 
                color: "#666",
                fontSize: "1rem",
                marginBottom: "0.5rem"
              }}>
                رقم الهاتف
              </h3>
              <p style={{ 
                color: "#4d5156",
                fontSize: "1.1rem"
              }}>
                📞 {profile.phone_number}
              </p>
            </div>
          )}

          {profile.email && (
            <div>
              <h3 style={{ 
                color: "#666",
                fontSize: "1rem",
                marginBottom: "0.5rem"
              }}>
                البريد الإلكتروني
              </h3>
              <p style={{ 
                color: "#4d5156",
                fontSize: "1.1rem"
              }}>
                ✉️ {profile.email}
              </p>
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem"
        }}>
          {profile.phone_number && (
            <a
              href={`tel:${profile.phone_number}`}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#2ecc71",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              📞 اتصل الآن
            </a>
          )}
          
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3498db",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              ✉️ راسل عبر البريد
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkerProfile;