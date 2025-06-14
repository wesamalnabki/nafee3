// src/pages/SearchResults.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], query = "" } = location.state || {};

  const handleProfileClick = (profileId) => {
    navigate(`/worker/${profileId}`);
  };

  if (!results.length) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>نتائج البحث</h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          لم يتم العثور على نتائج لـ "{query}"
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "block",
            margin: "2rem auto",
            padding: "0.5rem 1rem",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          العودة للبحث
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        نتائج البحث لـ "{query}"
      </h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {results.map((profile) => (
          <div
            key={profile.profile_id}
            onClick={() => handleProfileClick(profile.profile_id)}
            style={{
              padding: "1rem",
              border: "1px solid #dfe1e5",
              borderRadius: "8px",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }
            }}
          >
            <h2 style={{ margin: "0 0 0.5rem 0", color: "#1a0dab" }}>
              {profile.name}
            </h2>
            <p style={{ margin: "0.5rem 0", color: "#4d5156" }}>
              {profile.service_description}
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              {profile.location && (
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  📍 {profile.location}
                </span>
              )}
              {profile.phone_number && (
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  📞 {profile.phone_number}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          display: "block",
          margin: "2rem auto",
          padding: "0.5rem 1rem",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        العودة للبحث
      </button>
    </div>
  );
}

export default SearchResults;
