import React from 'react';
import image from "../images/Ellipse 2.png"
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <div className="relative">
      {/* Large half-circle background */}
      <img src={image} alt="Half Circle" className="absolute top-[-300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1175px] h-[1318px]" />
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 text-white relative z-10">
        <div className="text-xl font-bold">DealTracker</div>
        <div className="flex gap-14">
        <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/track">Track Product</Link>
          <button className="ml-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;