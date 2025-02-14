import React from 'react';
import Navbar from './components/Navbar';
import Hero from './pages/Home';
import Features from './components/FeatureCard';
import Footer from './components/Footer';

const App = () => {
  return (
    <div 
      className="min-h-screen w-100px px-15 bg-[#00083B] "
      style={{
        background: `
          radial-gradient(circle at top right, #1A1A3F, transparent),
          radial-gradient(circle at top left, #2A2A4D, transparent),
          radial-gradient(circle at bottom left, #1A1A3F, transparent),
          #00083B
        `
      }}
    >
      <div className="max-w-7xl mx-auto ">
        <Navbar />
        <Hero />
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default App;
