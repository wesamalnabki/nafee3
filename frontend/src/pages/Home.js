// src/pages/Home.js
import React, { useState } from "react";
import { searchProfiles } from "../services/api";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

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
        {results.map((profile) => (
          <div 
            key={profile.profile_id} 
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid #dfe1e5",
              backgroundColor: "white",
              borderRadius: "8px",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            <h2 style={{ 
              margin: "0 0 0.5rem 0",
              color: "#1a0dab",
              fontSize: "1.2rem"
            }}>
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
        ))}

        {/* No Results Message - Only show when search has been performed and returned no results */}
        {hasSearched && !loading && results.length === 0 && (
          <p style={{ 
            textAlign: "center",
            color: "#666",
            fontSize: "1.1rem"
          }}>
            لم يتم العثور على نتائج للبحث
          </p>
        )}

        {/* Initial State Message - Only show when no search has been performed */}
        {!hasSearched && !loading && (
          <p style={{ 
            textAlign: "center",
            color: "#666",
            fontSize: "1.1rem"
          }}>
            اكتب وصف الخدمة التي تبحث عنها في مربع البحث
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
