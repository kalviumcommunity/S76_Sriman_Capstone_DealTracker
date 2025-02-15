import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './pages/Home';
import Features from './components/FeatureCard';
import Footer from './components/Footer';
import TrackProduct from "./pages/TrackProduct";
import NotFound from './pages/NotFound';

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
            <Route path="/track" element={<TrackProduct />} />
            
            {/* 404 Not Found Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        {/* Footer Section */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
