import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DebateIntro() {
  const navigate = useNavigate();
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtitle(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate("/select-rvd");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-10">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Welcome to the{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            CONSIDER
          </span>{" "}
          demo
        </h1>

        <p
          className={`text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${
            showSubtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          You’re now entering the topic selection stage. You’ll choose a
          controversial issue you care about, then explore how you respond to
          an opposing perspective.
        </p>

        <div className="space-y-4 pt-4">
          <p className="text-sm md:text-base text-slate-400">
            When you’re ready, click the robot to begin.
          </p>

          <div className="pt-12">
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-4 shadow-xl shadow-cyan-500/30 hover:scale-105 hover:shadow-cyan-500/50 transition duration-300 animate-bounce"
            >
              <img src="/robot.png" className="w-20 h-20" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
