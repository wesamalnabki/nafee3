// src/pages/Home.js
import React, { useState } from "react";
import { searchProfiles } from "../services/api";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/auth";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log('Sending search request with query:', query);
      const response = await searchProfiles(query, 0.1, 50);
      console.log('Search response:', response);
      // Log each profile's structure
      response.forEach((profile, index) => {
        console.log(`Profile ${index} structure:`, {
          profile_id: profile.profile_id,
          keys: Object.keys(profile)
        });
      });
      setResults(response);
    } catch (err) {
      console.error("Search error:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.detail || "حدث خطأ أثناء البحث");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (profileId) => {
    console.log('Clicked profile ID:', profileId); // Debug log
    if (!profileId) {
      console.error('Profile ID is undefined!');
      return;
    }
    navigate(`/worker/${profileId}`);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img 
          src="/nafee3_logo.png" 
          alt="Nafee3 Logoooo" 
          style={{ 
            maxWidth: "200px",
            height: "auto"
          }} 
        />
      </div>

      {/* Search Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ 
          margin: "0 0 1rem 0",
          color: "#1a0dab",
          fontSize: "1.5rem",
          textAlign: "center"
        }}>
          ابحث عن أفضل مقدمي الخدمات
        </h1>

        <form onSubmit={handleSearch}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب وصف الخدمة التي تبحث عنها..."
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "1px solid #dfe1e5",
                borderRadius: "4px",
                fontSize: "1rem"
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "#2ecc71",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "جاري البحث..." : "بحث"}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <p style={{ 
          color: "#e74c3c", 
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          {error}
        </p>
      )}

      {/* Search Results */}
      <div style={{ marginTop: "2rem" }}>
        {results.map((profile) => {
          console.log('Rendering profile:', profile); // Debug log
          return (
            <div 
              key={profile.profile_id} 
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid #dfe1e5",
                backgroundColor: "white",
                borderRadius: "8px",
                marginBottom: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                display: "flex",
                gap: "1.5rem"
              }}
            >
              {/* Profile Photo */}
              <div style={{ flexShrink: 0 }}>
                {profile.profile_photo ? (
                  <img
                    src={getImageUrl(profile.profile_photo)}
                    alt={profile.full_name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "3px solid #fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      fontSize: "2rem"
                    }}
                  >
                    👤
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div style={{ flex: 1 }}>
                <h2 
                  onClick={() => {
                    console.log('Profile clicked:', profile); // Debug log
                    handleProfileClick(profile.profile_id);
                  }}
                  style={{ 
                    margin: "0 0 0.5rem 0",
                    color: "#1a0dab",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  {profile.full_name}
                </h2>

                <p style={{ 
                  color: "#4d5156",
                  marginBottom: "1rem",
                  fontSize: "1rem",
                  lineHeight: "1.5"
                }}>
                  {profile.service_description}
                </p>

                <div style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  color: "#4d5156",
                  fontSize: "0.9rem"
                }}>
                  {profile.service_city && (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      📍 {profile.service_city} {profile.service_area ? `- ${profile.service_area}` : ''}
                    </span>
                  )}
                  
                  {profile.phone_number && (
                    <a 
                      href={`tel:${profile.phone_number}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        color: "#1a0dab",
                        textDecoration: "none"
                      }}
                    >
                      📞 {profile.phone_number}
                    </a>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1rem"
                }}>
                  {profile.phone_number && (
                    <a
                      href={`tel:${profile.phone_number}`}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#2ecc71",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      📞 اتصل الآن
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* No Results Message - Only show when search has been performed and returned no results */}
        {hasSearched && !loading && results.length === 0 && (
          <p style={{ 
            textAlign: "center", 
            color: "#4d5156",
            fontSize: "1.1rem"
          }}>
            لم يتم العثور على نتائج للبحث
          </p>
        )}

        {/* Initial State Message - Only show when no search has been performed */}
        {!hasSearched && !loading && results.length === 0 && (
          <p style={{ 
            textAlign: "center", 
            color: "#4d5156",
            fontSize: "1.1rem"
          }}>
            اكتب وصف الخدمة التي تبحث عنها في مربع البحث أعلاه
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
