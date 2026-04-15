import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { analyzeConversation } from "./api";
import "./Results.css";

function ScoreBar({ label, score, explanation }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>{score}/10</span>
      </div>

      <div className="w-full h-2 bg-slate-700 rounded-full">
        <div
          className="h-2 bg-cyan-400 rounded-full"
          style={{ width: `${score * 10}%` }}
        />
      </div>

      <p className="text-xs text-slate-400">{explanation}</p>
    </div>
  );
}

function Results() {
  const location = useLocation();

  const conversationId = location.state?.conversationId;
  const topic = location.state?.topic;
  const summary = location.state?.summary;

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await analyzeConversation(conversationId, topic, summary);
        setAnalysis(res.data.analysis);
      } catch (err) {
        console.error("Analysis error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) fetchAnalysis();
  }, [conversationId, topic, summary]);

  if (loading) {
    return (
      <div className="results-wrapper">
        <div className="results-card">
          <h2 className="results-title">Analyzing conversation...</h2>
          <p className="results-text">This takes a few seconds.</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="results-wrapper">
        <div className="results-card">
          <h2 className="results-title">Something went wrong</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="results-wrapper">
      <div className="results-card space-y-10">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Analysis</h2>
          <p className="text-slate-400">{topic}</p>
        </div>

        {/* 🧠 PROFILES */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-white">🧠 Perspectives</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/10">
              <p className="text-cyan-300 text-sm mb-1">You</p>
              <p className="font-bold text-white text-lg">
                {analysis.userProfile.label}
              </p>
              <p className="text-slate-300 mt-2">
                {analysis.userProfile.summary}
              </p>
            </div>

            <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/10">
              <p className="text-purple-300 text-sm mb-1">AI</p>
              <p className="font-bold text-white text-lg">
                {analysis.aiProfile.label}
              </p>
              <p className="text-slate-300 mt-2">
                {analysis.aiProfile.summary}
              </p>
            </div>
          </div>
        </section>

        {/* 📊 SCORES */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-white">📊 Scores</h3>

          <div className="space-y-6">
            <ScoreBar
              label="Polarisation"
              score={analysis.scorecard.polarisationEstimate.score}
              explanation={analysis.scorecard.polarisationEstimate.explanation}
            />

            <ScoreBar
              label="Disagreement Depth"
              score={analysis.scorecard.disagreementDepth.score}
              explanation={analysis.scorecard.disagreementDepth.explanation}
            />
          </div>
        </section>

        {/* ⚠️ DISAGREEMENTS */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-red-300">
            ⚠️ Key Disagreements
          </h3>

          <div className="space-y-4">
            {analysis.keyDisagreements.map((item, i) => (
              <div
                key={i}
                className="bg-red-500/10 border border-red-400/20 p-4 rounded-xl"
              >
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-slate-300 text-sm mt-1">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🤝 AGREEMENTS */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-green-300">
            🤝 Agreements
          </h3>

          <div className="space-y-4">
            {analysis.keyAgreements.map((item, i) => (
              <div
                key={i}
                className="bg-green-500/10 border border-green-400/20 p-4 rounded-xl"
              >
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-slate-300 text-sm mt-1">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🧭 DYNAMICS */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-white">
            🧭 Conversation Dynamics
          </h3>

          <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/10 space-y-2">
            <p>
              <strong className="text-slate-300">Tone:</strong>{" "}
              {analysis.conversationDynamics.tone}
            </p>

            <p>
              <strong className="text-slate-300">Movement:</strong>{" "}
              {analysis.conversationDynamics.movement}
            </p>

            <p className="text-slate-300 mt-2">
              {analysis.conversationDynamics.notes}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Results;