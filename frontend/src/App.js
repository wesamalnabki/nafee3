// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import WorkerProfile from "./pages/WorkerProfile";

function App() {
  return (
    <Router>
      <div dir="rtl" style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
        <Header />
        <main style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/worker/:profileId" element={<WorkerProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
