import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { analyzeConversation } from "./api";
import "./Results.css";

function ScoreBar({ label, score, explanation }) {
  const barColour =
    score <= 3 ? "bg-green-400" :
    score <= 6 ? "bg-amber-400" :
                 "bg-red-400";

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>{score}/10</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full">
        <div
          className={`h-2 ${barColour} rounded-full transition-all duration-500`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">{explanation}</p>
    </div>
  );
}

function Tooltip({ text }) {
  const [visible, setVisible] = useState(false);
  return (
    <span 
      className="relative inline-block ml-1.5 align-middle"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <button
        className="text-slate-500 hover:text-slate-300 text-xs leading-none focus:outline-none"
        aria-label="More information"
      >
        ⓘ
      </button>
      {visible && (
        <span className="absolute z-10 left-6 top-0 w-64 bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-xl p-3 shadow-xl leading-relaxed">
          {text}
        </span>
      )}
    </span>
  );
}

function MoralFoundationRow({ dimension, score, explanation }) {
  const barColour =
    score <= 3 ? "bg-slate-500" :
    score <= 6 ? "bg-cyan-500" :
                 "bg-cyan-300";

  return (
    <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white text-sm font-medium">{dimension}</span>
        <span className="text-slate-400 text-xs">{score}/10</span>
      </div>
      <div className="w-full h-1.5 bg-slate-700 rounded-full">
        <div
          className={`h-1.5 ${barColour} rounded-full transition-all duration-500`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <p className="text-slate-400 text-xs leading-relaxed">{explanation}</p>
    </div>
  );
}

const DISAGREEMENT_TYPE_LABELS = {
  empirical:  "Evidence-based disagreement",
  principled: "Values-based disagreement",
  mixed:      "Factual & values disagreement",
};

const DISAGREEMENT_TYPE_TOOLTIPS = {
  empirical:  "You are disagreeing primarily about facts, evidence, or causal claims. In principle, these disagreements can be resolved by looking at evidence together.",
  principled: "You are disagreeing primarily about values, rights, or what matters morally. These disagreements cannot be resolved by evidence alone — they reflect genuinely different principles.",
  mixed:      "Your disagreement involves both factual claims and underlying value differences. Separating these two threads can help clarify where the real conflict lies.",
};

function Results() {
  const location = useLocation();
  const conversationId = location.state?.conversationId;
  const topic = location.state?.topic;
  const summary = location.state?.summary;

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const cacheKey = `analysis_${conversationId}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        setAnalysis(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const res = await analyzeConversation(conversationId, topic, summary);
        setAnalysis(res.data.analysis);
        sessionStorage.setItem(cacheKey, JSON.stringify(res.data.analysis));
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
          <div className="results-placeholder">
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

        {/* PROFILES */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Value Profiles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { profile: analysis.userProfile, colour: "cyan", label: "You" },
              { profile: analysis.aiProfile, colour: "purple", label: "AI" },
            ].map(({ profile, colour, label }) => (
              <div
                key={label}
                className="bg-slate-800/50 p-5 rounded-2xl border border-white/10 space-y-3"
              >
                <p className={`text-${colour}-300 text-sm`}>{label}</p>
                <p className="font-bold text-white text-lg">{profile.label}</p>

                {profile.coreValues?.length > 0 && (
                  <ul className="space-y-1">
                    {profile.coreValues.map((v, i) => (
                      <li key={i} className={`text-base text-${colour}-300 flex items-center gap-2`}>
                        <span className={`w-1 h-1 rounded-full bg-${colour}-400 flex-shrink-0`} />
                        {v}
                      </li>
                    ))}
                  </ul>
                )}
                {profile.reasoningStyle && (
                  <p className="text-xs text-slate-400 italic">{profile.reasoningStyle}</p>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* NATURE OF THE DISAGREEMENT */}
        {analysis.disagreementType && (
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Nature of the Disagreement</h3>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-white">
                {DISAGREEMENT_TYPE_LABELS[analysis.disagreementType.classification] ?? analysis.disagreementType.classification}
              </p>
              <Tooltip text={DISAGREEMENT_TYPE_TOOLTIPS[analysis.disagreementType.classification] ?? ""} />
            </div>
            <p className="text-slate-400 text-sm">{analysis.disagreementType.explanation}</p>
          </section>
        )}

        {/* 🎯 ROOT OF THE DISAGREEMENT */}
        {analysis.crux && (
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Root of the Disagreement</h3>
            <div className="flex items-start gap-3 pt-1">
              <p className="text-white font-medium text-base leading-snug">{analysis.crux.claim}</p>
              <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full border border-white/10 text-slate-500 mt-0.5">
                {analysis.crux.type === "factual" ? "Factual" : "Value"}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{analysis.crux.explanation}</p>
          </section>
        )}


        {/* 🧭 MORAL FOUNDATIONS */}
        {analysis.moralFoundations?.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-1">
              <h3 className="text-xl font-semibold text-white">Moral Foundations</h3>
              <Tooltip text="Based on Moral Foundations Theory (Haidt). Scores how prominently each moral consideration featured in your reasoning, with direct reference to what you said. Scored 0–10." />
            </div>
            <div className="space-y-3">
              {analysis.moralFoundations.map((f, i) => (
                <MoralFoundationRow
                  key={i}
                  dimension={f.dimension}
                  score={f.score}
                  explanation={f.explanation}
                />
              ))}
            </div>
          </section>
        )}

        {/* 📏 EPISTEMIC HUMILITY */}
        {analysis.epistemicHumility && (
          <section className="space-y-4">
            <div className="flex items-center gap-1">
              <h3 className="text-xl font-semibold text-white">Epistemic Humility</h3>
              <Tooltip text="Did you show openness to uncertainty, qualify your claims, or update your thinking during the conversation? Higher scores reflect more openness and responsiveness to counterarguments." />
            </div>
            <ScoreBar
              label="Openness to updating"
              score={analysis.epistemicHumility.score}
              explanation={analysis.epistemicHumility.explanation}
            />
          </section>
        )}

        {/* 🌐 WHERE YOU STAND */}
        {analysis.overtonPosition && (
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Where You Stand</h3>
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/10">
              <p className="text-slate-300 text-sm">{analysis.overtonPosition.description}</p>
            </div>
          </section>
        )}

        {/* ⚠️ KEY DISAGREEMENTS */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-red-300">Key Disagreements</h3>
          {analysis.keyDisagreements.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No clear disagreements identified.</p>
          ) : (
            <div className="space-y-4">
              {analysis.keyDisagreements.map((item, i) => (
                <div key={i} className="bg-red-500/10 border border-red-400/20 p-4 rounded-xl">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-slate-300 text-sm mt-1">{item.summary}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 🤝 KEY AGREEMENTS */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-green-300">Key Agreements</h3>
          {analysis.keyAgreements.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No clear agreement between parties.</p>
          ) : (
            <div className="space-y-4">
              {analysis.keyAgreements.map((item, i) => (
                <div key={i} className="bg-green-500/10 border border-green-400/20 p-4 rounded-xl">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-slate-300 text-sm mt-1">{item.summary}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 🌿 POTENTIAL COMMON GROUND */}
        {analysis.potentialAgreements?.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-300">Potential Common Ground</h3>
            <p className="text-sm text-slate-400">
              Points where agreement may be possible, but wasn't directly stated.
            </p>
            <div className="space-y-4">
              {analysis.potentialAgreements.map((item, i) => (
                <div key={i} className="bg-amber-500/10 border border-dashed border-amber-400/30 p-4 rounded-xl">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-slate-300 text-sm mt-1">{item.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 🔄 CONVERSATION DYNAMICS */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Conversation Dynamics</h3>
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/10 space-y-2">
            <p>
              <strong className="text-slate-300">Tone:</strong>{" "}
              {analysis.conversationDynamics.tone}
            </p>
            <p>
              <strong className="text-slate-300">Movement:</strong>{" "}
              {analysis.conversationDynamics.movement}
            </p>
            <p className="text-slate-300 mt-2">{analysis.conversationDynamics.notes}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/select-rvd"
            className="text-center px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-sm font-medium"
          >
            Try another topic
          </a>
          <a
            href="/"
            className="text-center px-6 py-3 rounded-xl bg-slate-700/50 border border-white/10 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            Back to home
          </a>
        </section>

      </div>
    </div>
  );
}

export default Results;
