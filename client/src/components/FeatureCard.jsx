import React from 'react';
import featureImage1 from '../images/feature1.png';
import featureImage2 from '../images/feature2.png';
import featureImage3 from '../images/feature3.png';
import featureImage4 from '../images/feature4.png';
import image3 from "../images/Ellipse 3.png"
import image2 from "../images/Ellipse 1.png"


const FeatureCard = ({ title, imageSrc }) => {
    return (
      <div className="flex flex-col items-center gap-3">
         <img
            src={image3} 
            alt="Half Circle" 
            className="absolute top-[1100px] right-[-360px] transform translate-x-1/2 -translate-y-1/2 w-[1128px] h-[1032px] opacity-50"
        />
        <img 
            src={image2} 
            alt="Half Circle" 
            className="absolute top-[800px] left-[-1050px] transform translate-x-1/2 -translate-y-1/2 w-[829px] h[883px] opacity-50" 
        />
        {/* Fixed size box container */}
        <div className="w-full h-52 bg-[#5C6394] bg-opacity-40 rounded-lg p-8 flex items-center justify-center">
          <div className="w-full h-full relative">
            <img 
              src={imageSrc} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
        {/* Title below the box */}
        <h3 className="text-xl font-semibold text-white text-center mt-2">
          {title}
        </h3>
      </div>
    );
  };
  
  const Features = () => {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <FeatureCard 
            title="Product Search & Comparison" 
            imageSrc={featureImage1}
          />
          <FeatureCard 
            title="Tracked Products List" 
            imageSrc={featureImage2}
          />
          <FeatureCard 
            title="AI-Powered Price Prediction" 
            imageSrc={featureImage3}
          />
          <FeatureCard 
            title="Price Alerts" 
            imageSrc={featureImage4}
          />
        </div>
      </div>
    );
  };
export default Features;