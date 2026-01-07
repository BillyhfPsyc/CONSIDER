import React from 'react';
import './Results.css';

function Results() {
  return (
    <div className="results-wrapper">
      <div className="results-card" role="region" aria-labelledby="results-title">
        <h2 id="results-title" className="results-title">Conversation Summary</h2>
        <p className="results-text">
            A detailed summary of the discussion and accompanying visualisations will appear here.
        </p>

        {/* Placeholder skeleton lines representing multiple visualisations */}
        <div className="results-placeholder">
          <div className="placeholder-line" />
          <div className="placeholder-line" />
          <div className="placeholder-line" />
          <div className="placeholder-line short" />
          <div className="placeholder-line" />
          <div className="placeholder-line" />
          <div className="placeholder-line short" />
          <div className="placeholder-line" />
          <div className="placeholder-line" />
          <div className="placeholder-line short" />
        </div>
      </div>
    </div>
  );
}

export default Results;