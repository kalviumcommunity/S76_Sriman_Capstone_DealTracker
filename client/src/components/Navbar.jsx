import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import image from "../images/Ellipse 2.png";
import AuthModal from "./AuthModal.jsX";
import Dashboard from "../pages/Dashboard";
const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // 🔹 Fetch User Details if Token Exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserDetails(token);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const res = await axios.get("http://localhost:5001/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.name) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      handleLogout(); // If error, clear user session
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="relative">
      <img
        src={image}
        alt="Half Circle"
        className="absolute top-[-300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1175px] h-[1318px]"
      />

      <nav className="flex justify-between items-center p-4 text-white relative z-10">
        <div className="text-xl font-bold">DealTracker</div>
        <div className="flex gap-14">
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/track">Track Product</Link>

          {user ? (
            <div className="relative">
              {/* 🔹 Profile Button (No Username) */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center bg-gray-700 px-4 py-2 rounded-full focus:outline-none"
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* 🔹 Dropdown: Username Only Visible When Clicked */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg p-2">
                  <p className="px-4 py-2 font-semibold">{user.name}</p>
                  <button
                    onClick={() => setIsDashboardOpen(true)}
                    className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="ml-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* 🔹 Auth Modal */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setUser={setUser} />
      {isDashboardOpen && <Dashboard onClose={() => setIsDashboardOpen(false)} />}
    </div>
  );
};

export default Navbar;
