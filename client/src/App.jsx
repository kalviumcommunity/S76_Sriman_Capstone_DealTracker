import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './pages/Home';
import Features from './components/FeatureCard';
import Footer from './components/Footer';
import TrackProduct from "./pages/TrackProduct"

const App = () => {
  return (
    <Router>
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
        <div className="max-w-7xl mx-auto">
          <Navbar />
          <Routes>
            <Route path="/" element={<><Hero /><Features /></>} />
            <Route path="/track" element={<TrackProduct />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
