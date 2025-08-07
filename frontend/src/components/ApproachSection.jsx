// components/ApproachSection.jsx
import React from "react";
import "./ApproachSection.css";
import { Atom, Brain, Bot } from "lucide-react";

export default function ApproachSection() {
  return (
    <section className="approach-section">
      <div className="approach-heading-wrapper">
        <h2 className="approach-title">Our Interdisciplinary Approach</h2>
        <p className="approach-subtitle">
          Combining philosophy, psychology, and AI to create meaningful dialogue
        </p>
        <div className="underline" />
      </div>

      <div className="approach-grid">
        <div className="approach-card">
          <div className="approach-icon-wrapper indigo">
            <Atom className="approach-icon" />
          </div>
          <h3>Philosophy</h3>
          <p>
            Drawing from Mill's trident and other frameworks to structure meaningful disagreement.
          </p>
        </div>

        <div className="approach-card">
          <div className="approach-icon-wrapper purple">
            <Brain className="approach-icon" />
          </div>
          <h3>Psychology</h3>
          <p>
            Incorporating cognitive science to reduce defensive reactions and promote reflection.
          </p>
        </div>

        <div className="approach-card">
          <div className="approach-icon-wrapper blue">
            <Bot className="approach-icon" />
          </div>
          <h3>AI Research</h3>
          <p>
            Developing models that generate nuanced counterarguments to challenge core values.
          </p>
        </div>
      </div>
    </section>
  );
}
