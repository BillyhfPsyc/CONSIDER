// components/ChallengeSection.jsx
import React from "react";
import "./ChallengeSection.css";
import { AlertTriangle, MessageCircleOff, ArrowLeftRight } from "lucide-react";

export default function ChallengeSection() {
  return (
    <section className="challenge-section">
      {/* Centered Heading */}
      <div className="challenge-heading-wrapper">
        <h2 className="challenge-heading">The Challenge of Polarized Discourse</h2>
        <div className="underline" />
      </div>

      {/* Grid layout: text on left, cards on right */}
      <div className="challenge-container">
        <div className="challenge-text">
          <p>
            Polarized disagreement on high-stakes issues like immigration, climate change, and identity politics strains democratic discourse and public wellbeing. Conversations increasingly devolve into bad-faith attacks or are avoided entirely out of fear.
          </p>
          <p>
            Meanwhile, AI is often used to intensify division, fueling political campaigns that entrench identities and trap users in ideological echo chambers. Despite this, there's a lack of scalable tools that help individuals safely explore their own views and those of others.
          </p>
          <p>
            The challenge isn't disagreement itself, but the access to structured and reflective engagement on polarized topics.
          </p>
        </div>

        <div className="challenge-cards">
          <div className="challenge-card red">
            <div className="icon-circle red-bg">
              <AlertTriangle className="challenge-icon" />
            </div>
            <h3>Echo Chambers</h3>
            <p>
              Algorithms reinforce existing beliefs by showing users content that aligns with their views, limiting exposure to diverse perspectives.
            </p>
          </div>

          <div className="challenge-card yellow">
            <div className="icon-circle yellow-bg">
              <MessageCircleOff className="challenge-icon" />
            </div>
            <h3>Avoidance</h3>
            <p>
              Many avoid difficult conversations altogether due to fear of conflict or not knowing how to engage productively.
            </p>
          </div>

          <div className="challenge-card blue">
            <div className="icon-circle blue-bg">
              <ArrowLeftRight className="challenge-icon" />
            </div>
            <h3>Polarization</h3>
            <p>
              Extreme positions dominate public discourse, leaving little room for nuance or common ground.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
