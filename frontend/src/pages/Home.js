// src/pages/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProfiles } from "../services/api";

function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchProfiles(query);
      navigate("/search", { state: { results, query } });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "15vh",
      backgroundColor: "#fff"
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "2rem" }}>
        <img 
          src="/nafee3_logo.png" 
          alt="Nafee3 Logo" 
          style={{ 
            width: "272px",
            height: "auto"
          }}
        />
      </div>

      {/* Search Box */}
      <form 
        onSubmit={handleSearch}
        style={{
          width: "100%",
          maxWidth: "584px",
          position: "relative",
          margin: "0 auto"
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #dfe1e5",
          borderRadius: "24px",
          padding: "0 16px",
          height: "44px",
          boxShadow: "0 1px 6px rgba(32,33,36,.28)",
          transition: "box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          ":hover": {
            boxShadow: "0 1px 6px rgba(32,33,36,.28)"
          }
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب ما تحتاجه"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              padding: "0 8px",
              backgroundColor: "transparent",
              direction: "rtl"
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              marginRight: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "54px",
              height: "36px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "جاري البحث..." : "بحث"}
          </button>
        </div>
      </form>

      {/* Search Tips */}
      <div style={{
        marginTop: "2rem",
        textAlign: "center",
        color: "#666",
        fontSize: "14px"
      }}>
        <p>ابحث عن خدمات مثل: طاقة شمسية، كهرباء، نجارة، وغيرها</p>
      </div>
    </div>
  );
}

export default Home;
