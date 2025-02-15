import React from 'react';
import image2 from "../images/Ellipse 1.png";
import image3 from "../images/Ellipse 3.png"
import image1 from "../images/Ellipse 1.png"
import pic1 from "../images/pic1.png"
import pic2 from "../images/pic2.png"
import productImage from "../images/dummy.png"

const TrackProduct = () => {
  return (
    <div className="flex flex-col gap-16 mb-20 relative">
      {/* Background ellipse */}
      <img
        src={image2}
        alt="Half Circle"
        className="absolute top-[400px] right-[-100px] transform translate-x-1/2 -translate-y-1/2 w-[829px] h-[883px]"
      />
      <img
            src={image3} 
            alt="Half Circle" 
            className="absolute top-[1100px] right-[-360px] transform translate-x-1/2 -translate-y-1/2 w-[1128px] h-[1032px] opacity-50"
        />
        <img 
            src={image1} 
            alt="Half Circle" 
            className="absolute top-[800px] left-[-1050px] transform translate-x-1/2 -translate-y-1/2 w-[829px] h[883px] opacity-50" 
        />

{/* Hero section */}
<div className="flex items-center justify-between pt-12">
  <div className="w-1/2 relative flex flex-col gap-8">
    <div className="flex justify-end mr-[30px]"> 
      <img 
        src={pic1}
        alt='pic1'
        className="w-49 h-40 object-contain"
      />
    </div>
    
    <div className="flex justify-start ml-[90px]"> 
      <img 
        src={pic2}
        alt='pic2'
        className="w-49 h-42 object-contain"
      />
    </div>
  </div>

        <div className="w-1/2 text-right">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Analyse prices,
            <br />
            discover
            <br />
            the best deals
          </h1>
          <p className="text-gray-300 text-lg">
            Track a products price history and visualize
            <br />
            trends instantly.
            <br />
            Unlock the best offers at the right time
          </p>
        </div>
      </div>

      {/* Search and Products Section */}
      <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-white text-center mb-4">What are you looking for?</h2>
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full p-4 pl-12 rounded-full bg-[#2A2A4D] bg-opacity-40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4AA3BA]"
          />
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <button className="px-6 py-2 rounded-full bg-[#2A2A4D] bg-opacity-40 text-white hover:bg-opacity-60">
            Price ▼
          </button>
          <button className="px-6 py-2 rounded-full bg-[#2A2A4D] bg-opacity-40 text-white hover:bg-opacity-60">
            Ratings ▼
          </button>
          <button className="px-6 py-2 rounded-full bg-[#2A2A4D] bg-opacity-40 text-white hover:bg-opacity-60">
            Discount Offers ▼
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-6 mt-8">
            {[1, 2, 3, 4].map((item) => (
    <div key={item} className="bg-[#5C6394] bg-opacity-40 rounded-lg p-4">
      <div className="relative">
        {/* Product Image */}
        <img 
          src={productImage} 
          alt="Product" 
          className="h-48 w-full object-cover rounded-lg mb-4"
        />
        
        {/* Heart Button */}
        <button className="absolute top-2 right-2 text-white hover:text-[#4AA3BA]">
          ♥
        </button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">VSports Nuke Sports Shoes</h3>
        <div className="flex justify-between items-center">
          <span className="text-white">$390</span>
          <span className="text-white bg-[#1A1A3F] bg-opacity-50 px-2 py-1 rounded">
            ⭐ 4.7
          </span>
        </div>
        <button className="w-full bg-[#FF0051] text-white py-2 rounded-lg hover:bg-opacity-90">
          Compare
        </button>
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
};

export default TrackProduct;