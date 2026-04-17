// src/Toggle.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Toggle() {
  const navigate = useNavigate();
  const location = useLocation();

  const [disagreeability, setDisagreeability] = useState(80);
  const [specificFocus, setSpecificFocus] = useState("");

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
    if (x <= 20) return "Mostly curious and validating. Gentle alternative perspectives. Prefers questions over assertions.";
    if (x <= 40) return "Mild pushback with a calm tone. Acknowledges nuance and uncertainty.";
    if (x <= 60) return "Clear disagreement, but respectful. Challenges assumptions directly. Asks one focused question.";
    if (x <= 80) return "Firm and explicit disagreement. Prioritises strong counterarguments. Minimal hedging, no over-validating.";
    return "Very firm and persistent. Presses the strongest disagreement point. Blunt, but stays civil.";
  };

  const handleContinue = () => {
    navigate("/current-position", {
      state: { ...location.state, specificFocus: specificFocus.trim() || null },
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl shadow-black/30 p-8 md:p-10 space-y-10">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white text-center">
          Customise your debate
        </h1>

        {/* Disagreeability slider */}
        <div>
          <div className="flex items-end justify-between mb-3">
            <span className="text-slate-300 font-semibold">Disagreeability</span>
            <span className="text-cyan-300 font-mono font-semibold">{disagreeability}/100</span>
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

          <p className="mt-4 text-sm md:text-base text-slate-200">
            {getBandDescription(disagreeability)}
          </p>
        </div>

        {/* Specific focus input */}
        <div>
          <label className="block text-slate-300 font-semibold mb-2">
            Specific focus <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={specificFocus}
            onChange={(e) => setSpecificFocus(e.target.value)}
            placeholder='e.g. "undocumented workers crossing the border" for immigration'
            className="w-full rounded-2xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
          <p className="mt-2 text-xs text-slate-400">
            Ground the debate in a concrete case rather than the abstract topic. Leave blank to discuss the topic generally.
          </p>
        </div>

        <div className="flex justify-center">
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
