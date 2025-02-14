import React from 'react';
import HomeImage from "../images/home.png"
import image2 from "../images/Ellipse 1.png"

const Hero = () => {
    return (
      <div className="flex flex-col gap-16 mb-20 ">
         <img 
        src={image2} 
        alt="Half Circle" 
        className="absolute top-[400px] right-[-100px] transform translate-x-1/2 -translate-y-1/2 w-[829px] h-[883px]" 
      />
        {/* Main hero content */}
        <div className="flex items-center justify-between pt-12">
          <div className="w-1/2 pr-8">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Find the best prices,
              <br />
              anytime,
              <br />
              anywhere.
            </h1>
            <p className="text-gray-300 text-lg">
              Track prices in real-time, get instant alerts
              <br /> 
              on price drops, stay updated on the best deals.
            </p>
          </div>
          <div className="w-1/2 flex justify-end">
            <img 
              src={HomeImage} 
              alt="Deal Tracker" 
              className="w-4/5 h-auto object-contain"
            />
          </div>
        </div>
  
        {/* Search section */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-[#2A2A4D] bg-opacity-40 rounded-lg p-1">
            <input
              type="text"
              placeholder="Track the product here:"
              className="w-full p-4 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4AA3BA]"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-[#4AA3BA] text-white py-3 px-12 rounded-lg hover:bg-opacity-90 text-lg font-medium">
              Start Tracking
            </button>
          </div>
        </div>
      </div>
    );
  };
  
export default Hero;