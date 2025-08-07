// src/Home.jsx
import React from 'react';
import HeroSection from './components/HeroSection';
import { Link } from 'react-router-dom';
import './Home.css'; // still holds styles for the robot

export default function Home() {
  return (
    <div className="home-wrapper">
      <HeroSection />
      <div className="robot-container">
        <Link to="/debate-intro" className="robot-link">
          <img src="/robot.png" alt="Robot" className="robot-image" />
        </Link>
      </div>
    </div>
  );
}

