// components/HowItWorksSection.jsx
import React from "react";
import "./HowItWorksSection.css";
import { Search, MessageCircle, BarChart3 } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="how-heading-wrapper">
        <h2 className="how-title">How CONSIDER Works</h2>
        <p className="how-subtitle">
          A three-stage process for structured reflection and principled disagreement
        </p>
        <div className="underline" />
      </div>

      {/* Stages */}
      <div className="how-stages">
        <div className="stage">
          <div className="stage-indicator active">1</div>
          <h3>Clarification</h3>
        </div>
        <div className="stage-connector" />
        <div className="stage">
          <div className="stage-indicator">2</div>
          <h3>Conversation</h3>
        </div>
        <div className="stage-connector" />
        <div className="stage">
          <div className="stage-indicator">3</div>
          <h3>Contemplation</h3>
        </div>
      </div>

      {/* Cards */}
      <div className="how-cards">
        <div className="how-card">
          <div className="card-icon">
            <Search />
          </div>
          <h4>Clarify Your Position</h4>
          <p>
            Begin by articulating your beliefs on a complex issue. Our AI helps you refine and structure your arguments, identifying core values and assumptions.
          </p>
        </div>
        <div className="how-card">
          <div className="card-icon">
            <MessageCircle />
          </div>
          <h4>Engage with Opposition</h4>
          <p>
            Confront principled counterarguments tailored to your position. Choose tone and depth to fit your goals.
          </p>
        </div>
        <div className="how-card">
          <div className="card-icon">
            <BarChart3 />
          </div>
          <h4>Reflect and Visualize</h4>
          <p>
            See a structured map of your arguments, values, and divergences. Compare with community trends.
          </p>
        </div>
      </div>
    </section>
  );
}
