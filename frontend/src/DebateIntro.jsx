import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DebateIntro.css';

const delayedLines = [
    "Here, you'll engage in a discussion with an AI trained to argue against your position",   
    "Next, you’ll share your view—and the AI will respond with a thoughtful counterargument.",
    "There’s no right or wrong answer here. Feel free to speak openly, in whatever tone feels natural.",
    "When you're ready, press the robot icon to begin."
  ];

function DebateIntro() {
  const [visibleLines, setVisibleLines] = useState([
    "Welcome to DebateBot!"
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < delayedLines.length) {
        setVisibleLines(prev => [...prev, delayedLines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    navigate('/select-rvd');
  };

  return (
    <div className="debate-intro-container">
      <div className="intro-text-box">
        {visibleLines.map((line, index) =>
          index === 0 ? (
            <h1 key={index} className="intro-header">{line}</h1>
          ) : (
            <p key={index} className="intro-line">{line}</p>
          )
        )}
      </div>
      <img
        src="/robot.png"
        alt="Click to continue"
        className="robot-click"
        onClick={handleContinue}
        title="Click me to begin"
      />
    </div>
  );
}
  

export default DebateIntro;
