import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { analyzeConversation } from "./api";
import MessageBubble from "./components/chat/MessageBubble.jsx";
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
  const hideTimer = React.useRef(null);

  const show = () => {
    clearTimeout(hideTimer.current);
    setVisible(true);
  };

  const hide = () => {
    hideTimer.current = setTimeout(() => setVisible(false), 120);
  };

  return (
    <span className="relative inline-block ml-1.5 align-middle">
      <button
        className="text-slate-500 hover:text-slate-300 text-xs leading-none focus:outline-none"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-label="More information"
      >
        ⓘ
      </button>
      {visible && (
        <span
          className="absolute z-10 left-6 top-0 w-64 bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-xl p-3 shadow-xl leading-relaxed"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function MoralFoundationRow({ dimension, score, explanation }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white text-sm font-medium">{dimension}</span>
        <span className="text-slate-400 text-xs">{score}/10</span>
      </div>
      <div className="w-full h-1.5 bg-slate-700 rounded-full">
        <div
          className="h-1.5 bg-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <p className="text-slate-400 text-xs leading-relaxed">{explanation}</p>
    </div>
  );
}

function SectionCard({ children }) {
  return (
    <div className="bg-black/20 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:bg-black/30 hover:border-white/10 opacity-70 hover:opacity-100">
      {children}
    </div>
  );
}

function SectionTitle({ children, tooltip }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          {children}
        </h3>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div className="h-px w-8 bg-gradient-to-r from-cyan-400 to-transparent mt-2" />
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
  const navigate = useNavigate();
  const conversationId = location.state?.conversationId;
  const topic = location.state?.topic;
  const summary = location.state?.summary;
  const messages = location.state?.messages ?? [];

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

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
      <div className="results-card space-y-6">

        {/* TITLE */}
        <div className="text-center space-y-4 py-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Consider</p>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight pb-1">
            Conversation Analysis
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
          <p className="text-slate-400 text-sm tracking-wide">{topic}</p>
        </div>

        {/* VALUE PROFILES */}
        <SectionCard>
          <SectionTitle>Value Profiles</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { profile: analysis.userProfile, colour: "cyan", label: "You" },
              { profile: analysis.aiProfile, colour: "purple", label: "AI" },
            ].map(({ profile, colour, label }) => (
              <div key={label} className="space-y-3">
                <p className={`text-${colour}-300 text-sm uppercase tracking-wider`}>{label}</p>
                <p className="font-bold text-white text-lg">{profile.label}</p>
                {profile.coreValues?.length > 0 && (
                  <ul className="space-y-1">
                    {profile.coreValues.map((v, i) => (
                      <li key={i} className={`text-xs text-${colour}-300 flex items-center gap-2`}>
                        <span className={`w-1 h-1 rounded-full bg-${colour}-400 flex-shrink-0`} />
                        {v}
                      </li>
                    ))}
                  </ul>
                )}
                {profile.reasoningStyle && (
                  <p className="text-xs text-slate-500 italic">{profile.reasoningStyle}</p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* KEY DISAGREEMENTS */}
        <SectionCard>
          <SectionTitle>Key Disagreements</SectionTitle>
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
        </SectionCard>

        {/* KEY AGREEMENTS */}
        <SectionCard>
          <SectionTitle>Key Agreements</SectionTitle>
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
        </SectionCard>

        {/* POTENTIAL COMMON GROUND */}
        {analysis.potentialAgreements?.length > 0 && (
          <SectionCard>
            <SectionTitle>Potential Common Ground</SectionTitle>
            <p className="text-xs text-slate-500 mb-4">Points where agreement may be possible, but wasn't directly stated.</p>
            <div className="space-y-4">
              {analysis.potentialAgreements.map((item, i) => (
                <div key={i} className="bg-amber-500/10 border border-dashed border-amber-400/30 p-4 rounded-xl">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-slate-300 text-sm mt-1">{item.summary}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* NATURE OF THE DISAGREEMENT */}
        {analysis.disagreementType && (
          <SectionCard>
            <SectionTitle tooltip={DISAGREEMENT_TYPE_TOOLTIPS[analysis.disagreementType.classification]}>
              Nature of the Disagreement
            </SectionTitle>
            <p className="font-semibold text-white mb-2">
              {DISAGREEMENT_TYPE_LABELS[analysis.disagreementType.classification] ?? analysis.disagreementType.classification}
            </p>
            <p className="text-slate-400 text-sm">{analysis.disagreementType.explanation}</p>
          </SectionCard>
        )}

        {/* ROOT OF THE DISAGREEMENT */}
        {analysis.crux && (
          <SectionCard>
            <SectionTitle>Root of the Disagreement</SectionTitle>
            <div className="flex items-start gap-3">
              <p className="text-white font-medium text-base leading-snug">{analysis.crux.claim}</p>
              <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full border border-white/10 text-slate-500 mt-0.5">
                {analysis.crux.type === "factual" ? "Factual" : "Value"}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-3">{analysis.crux.explanation}</p>
          </SectionCard>
        )}

        {/* MORAL FOUNDATIONS */}
        {analysis.moralFoundations?.length > 0 && (
          <SectionCard>
            <SectionTitle tooltip="Based on Moral Foundations Theory (Haidt). Scores how prominently each moral consideration featured in your reasoning, with direct reference to what you said. Scored 0–10.">
              Moral Foundations
            </SectionTitle>
            <div className="space-y-5">
              {analysis.moralFoundations.map((f, i) => (
                <MoralFoundationRow
                  key={i}
                  dimension={f.dimension}
                  score={f.score}
                  explanation={f.explanation}
                />
              ))}
            </div>
          </SectionCard>
        )}

        {/* EPISTEMIC HUMILITY */}
        {analysis.epistemicHumility && (
          <SectionCard>
            <SectionTitle tooltip="Measures how openly you held your view — whether you qualified claims, acknowledged uncertainty, and engaged seriously with counterarguments. Holding a firm position does not reduce this score.">
              Epistemic Humility
            </SectionTitle>
            <ScoreBar
              label="Openness to uncertainty"
              score={analysis.epistemicHumility.score}
              explanation={analysis.epistemicHumility.explanation}
            />
          </SectionCard>
        )}

        {/* WHERE YOU STAND */}
        {analysis.overtonPosition && (
          <SectionCard>
            <SectionTitle>Where You Stand</SectionTitle>
            <p className="text-slate-300 text-sm">{analysis.overtonPosition.description}</p>
          </SectionCard>
        )}

        {/* REVIEW DISCUSSION */}
        {messages.length > 0 && (
          <div className="border border-white/5 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowTranscript((prev) => !prev)}
              className="w-full flex items-center justify-between px-6 py-4 bg-black/20 hover:bg-black/30 transition-colors text-left"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Review Discussion
              </span>
              <span className="text-slate-500 text-xs">
                {showTranscript ? "▲ Hide" : "▼ Show"}
              </span>
            </button>
            {showTranscript && (
              <div className="px-6 py-6 space-y-6 bg-slate-900/40">
                {messages.map((m, i) => (
                  <MessageBubble key={i} message={m.text} isUser={m.sender === "user"} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("conversationId");
              sessionStorage.removeItem("disagreeability");
              navigate("/select-rvd");
            }}
            className="text-center px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-sm font-medium"
          >
            Try another topic
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("conversationId");
              navigate("/");
            }}
            className="text-center px-6 py-3 rounded-xl bg-slate-700/50 border border-white/10 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            Back to home
          </button>
        </div>

      </div>
    </div>
  );
}

export default Results;