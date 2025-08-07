import React from "react";
import { MessageCircle, Users, Brain, Map } from "lucide-react";
import "./HeroSection.css"; 

export default function HeroSection() {
  return (
    <section className="hero">
      <h1 className="hero-title">
        <span className="gradient-text">Navigating</span><br />
        Intense Disagreement
      </h1>
      <p className="hero-subtitle">
        CONSIDER is a platform for thoughtful engagement with polarizing topics.
        Explore your beliefs, encounter principled opposition, and map the landscape of ethical reflection.
      </p>
      <h2 className="workflow-heading">Core Features:</h2>

      <div className="features-grid">
        <div className="feature-card blue">
          <MessageCircle className="icon" />
          <h3>Clarify</h3>
          <p>Articulate your position</p>
        </div>
        <div className="feature-card purple">
          <Users className="icon" />
          <h3>Converse</h3>
          <p>Engage with opposition</p>
        </div>
        <div className="feature-card green">
          <Brain className="icon" />
          <h3>Contemplate</h3>
          <p>Reflect on your values</p>
        </div>
        <div className="feature-card orange">
          <Map className="icon" />
          <h3>Map</h3>
          <p>Visualize your beliefs</p>
        </div>
      </div>
      <h2 className="workflow-heading">Click the below button to start!</h2>
    </section>
  );
}
