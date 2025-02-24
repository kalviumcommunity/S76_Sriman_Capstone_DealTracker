import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './pages/Home';
import Features from './components/FeatureCard';
import Footer from './components/Footer';
import TrackProduct from "./pages/TrackProduct";
import NotFound from './pages/NotFound';
import EnterUserName from './components/AuthSuccess';
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";


const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      fetchUserDetails(token);
    }

    navigate("/");
  }, []);

  const fetchUserDetails = async (token) => {
    const res = await fetch("http://localhost:5001/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
  };

  return <p>Authenticating...</p>;
};

const App = () => {
  return (
    <Router>
      {/* Main App Container with Background Styling */}
      <div
        className="min-h-screen w-100px px-15 bg-[#00083B]"
        style={{
          background: `
            radial-gradient(circle at top right, #1A1A3F, transparent),
            radial-gradient(circle at top left, #2A2A4D, transparent),
            radial-gradient(circle at bottom left, #1A1A3F, transparent),
            #00083B
          `
        }}
      >
        {/* Centered Content Wrapper */}
        <div className="max-w-7xl mx-auto">
          {/* Navigation Bar */}
          <Navbar />
          
          {/* Routing Configuration */}
          <Routes>
            {/* Home Page with Hero and Features */}
            <Route path="/" element={<><Hero /><Features /></>} />
            
            {/* Track Product Page */}
            <Route
              path="/track"
              element={
                <ProtectedRoute>
                  <TrackProduct />
                </ProtectedRoute>
              }
            />
            
            {/* Google Auth Success Route */}
            <Route path="/auth-success" element={<AuthSuccess />} />

            {/* 404 Not Found Page */}
            <Route path="*" element={<NotFound />} />

             <Route path="/enter-username" element={<EnterUserName />} /> 

             <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        
        {/* Footer Section */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
