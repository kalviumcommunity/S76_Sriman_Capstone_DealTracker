import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      {/* 404 Error Message */}
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      
      {/* Description */}
      <p className="text-gray-400 mt-2">
        Oops! The page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
