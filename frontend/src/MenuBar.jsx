import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';

function MenuBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [slidingOut, setSlidingOut] = useState(false);

  useEffect(() => {
    let timeout;
    if (!isOpen) {
      setSlidingOut(true);
      timeout = setTimeout(() => setSlidingOut(false), 200);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
        CONSIDER
        </Link>

      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className="nav-links desktop">
        <Link to="/">Home</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/play">Play</Link>
      </div>

      {(isOpen || slidingOut) && (
        <div className={`nav-links mobile ${isOpen ? 'animate-slide-in-down' : 'animate-slide-out-up'}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/faq" onClick={() => setIsOpen(false)}>FAQ</Link>
          <Link to="/play" onClick={() => setIsOpen(false)}>Play</Link>
        </div>
      )}
    </nav>
  );
}

export default MenuBar;
