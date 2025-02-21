import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const EnterUsername = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/auth/google-register", {
        email,
        name: username, // Send only email and name
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({ name: username, email }));
        navigate("/track");
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("Error:", err.response?.data);
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Enter Your Username</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-2 text-black"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterUsername;
