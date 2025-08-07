// components/HeroSection.jsx
import React from "react";
import "./HeroSection.css";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <h1 className="hero-heading">
          Navigate Polarized Topics<br />with Thoughtful Dialogue
        </h1>
        <p className="hero-description">
          CONSIDER is an AI platform for structured reflection on complex,
          divisive issues through principled disagreement.
        </p>
        <div className="hero-buttons">
          <Link to="/debate-intro" className="primary-button">Try the Demo</Link>
          <a href="#how-it-works" className="secondary-button">Learn More</a>
        </div>
      </div>
    </section>
  );
}
