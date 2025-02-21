import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image from "../images/SliderComponent-1.png"
import google from "../images/google.png"

const AuthModal = ({ isOpen, onClose, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({ name: res.data.name, email: res.data.email }));

        setUser({ name: res.data.name, email: res.data.email });
        alert("Login Successful!");
        onClose();
        navigate("/track");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, formData);
        alert("Registration Successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative z-50 bg-white rounded-3xl shadow-xl w-[800px] h-[600px] flex overflow-hidden rounded-bl-[120px]">
        {/* Left Side - Illustration with adjusted spacing and curves */}
        <div className="w-[42%] h-full pl-3 pt-3 pb-3">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-[#7CC9D6] rounded-tl-2xl rounded-tr-md rounded-br-3xl rounded-bl-[100px]">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img 
                  src={image} 
                  alt="Shopping Illustration" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-[58%] px-14 py-12">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3">WELCOME BACK</h2>
            <p className="text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
                required
              />
            )}

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-gray-600 hover:underline">
                Forgot password
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img
                src={google}
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>

            <p className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-500 hover:underline"
              >
                Sign up for free!
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;