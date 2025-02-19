import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // Login API
        const res = await axios.post("http://localhost:5001/api/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({ name: res.data.name, email: res.data.email }));

        setUser({ name: res.data.name, email: res.data.email });
        alert("Login Successful!");
        onClose();
        navigate("/track"); // Redirect to Track Product Page
      } else {
        // Register API
        await axios.post("http://localhost:5001/api/register", formData);
        alert("Registration Successful! Please log in.");
        setIsLogin(true); // Switch to login mode
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close Button (Cross) */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-sm mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 underline">
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
