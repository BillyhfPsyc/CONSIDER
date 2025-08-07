// src/Home.jsx
import React from 'react';
import HeroSection from './components/HeroSection';
import { Link } from 'react-router-dom';
import './Home.css'; // still holds styles for the robot
import ChallengeSection from './components/ChallengeSection';
import HowItWorksSection from './components/HowItWorksSection';
import ApproachSection from './components/ApproachSection';


export default function Home() {
  return (
    <div className="home-wrapper">
      <HeroSection />
      <ChallengeSection />
      <HowItWorksSection />
      <ApproachSection />
      <div className="robot-container">
        <Link to="/debate-intro" className="robot-link">
          <img src="/robot.png" alt="Robot" className="robot-image" />
        </Link>
      </div>
    </div>
  );
}

