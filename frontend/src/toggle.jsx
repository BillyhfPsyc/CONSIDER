// src/Toggle.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Toggle() {
  const navigate = useNavigate();
  const location = useLocation();

  const [disagreeability, setDisagreeability] = useState(80);

  useEffect(() => {
    const saved = sessionStorage.getItem("disagreeability");
    if (saved !== null) setDisagreeability(Number(saved));
  }, []);

  const handleChange = (e) => {
    const v = Number(e.target.value);
    setDisagreeability(v);
    sessionStorage.setItem("disagreeability", String(v));
  };

  const getBandDescription = (x) => {
    if (x <= 20) {
      return "Mostly curious and validating. Gentle alternative perspectives. Prefers questions over assertions.";
    }
    if (x <= 40) {
      return "Mild pushback with a calm tone. Acknowledges nuance and uncertainty.";
    }
    if (x <= 60) {
      return "Clear disagreement, but respectful. Challenges assumptions directly. Asks one focused question.";
    }
    if (x <= 80) {
      return "Firm and explicit disagreement. Prioritises strong counterarguments. Minimal hedging, no over-validating.";
    }
    return "Very firm and persistent. Presses the strongest disagreement point if needed, but stays civil and calm.";
  };

  const handleContinue = () => {
    navigate("/current-position", { state: location.state });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl shadow-black/30 p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white text-center">
          How disagreeable should the AI be?
        </h1>

        <div className="mt-10">
          <div className="flex items-end justify-between mb-3">
            <span className="text-slate-300 font-semibold">Disagreeability</span>
            <span className="text-cyan-300 font-mono font-semibold">
              {disagreeability}/100
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={disagreeability}
            onChange={handleChange}
            className="w-full accent-cyan-400"
          />

          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>

          <p className="mt-6 text-sm md:text-base text-slate-200">
            {getBandDescription(disagreeability)}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center justify-center rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 border border-white/15 hover:bg-white/10 hover:border-cyan-400/60 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toggle;
