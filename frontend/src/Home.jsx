// src/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  AlertTriangle,
  MessageCircleOff,
  ArrowLeftRight,
  Search,
  MessageCircle,
  BarChart3,
  Atom,
  Brain,
  Bot,
} from "lucide-react";

export default function Home() {
  const [activeStage, setActiveStage] = useState(1);

  const stages = [
    {
      id: 1,
      label: "Clarification",
      icon: Search,
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-300",
      circleBg: "bg-cyan-500",
      circleDull: "bg-slate-700",
      buttonBg: "bg-slate-950/80",
      title: "Clarify your position",
      description:
        "You begin by articulating your beliefs on a complex issue. CONSIDER helps you refine and structure your arguments, highlighting core values and assumptions.",
      cardBg: "border-cyan-500/30",
      cardGlow: "shadow-cyan-900/30",
    },
    {
      id: 2,
      label: "Conversation",
      icon: MessageCircle,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-300",
      circleBg: "bg-blue-500",
      circleDull: "bg-slate-700",
      buttonBg: "bg-slate-950/80",
      title: "Engage with opposition",
      description:
        "The system generates principled counterarguments tailored to your view, letting you choose a 'disagreement level' match your own goals for the conversation.",
      cardBg: "border-blue-500/30",
      cardGlow: "shadow-blue-900/30",
    },
    {
      id: 3,
      label: "Contemplation",
      icon: BarChart3,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-300",
      circleBg: "bg-purple-500",
      circleDull: "bg-slate-700",
      buttonBg: "bg-slate-950/80",
      title: "Reflect and visualise",
      description:
        "Afterwards, you see a structured summary of your arguments, values, and divergences, and can compare your pattern with broader trends.",
      cardBg: "border-purple-500/30",
      cardGlow: "shadow-purple-900/30",
    },
  ];

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative min-h-screen flex items-start justify-center px-6 pt-10 md:pt-14 overflow-hidden">
        {/* Main hero content */}
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Big image */}
          <div className="w-full flex justify-center py-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight 
                          bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500
                          text-transparent bg-clip-text drop-shadow-2xl">
              CONSIDER
            </h1>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
            Navigate{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Polarised Topics
            </span>
            <br />
            with Thoughtful Dialogue
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            CONSIDER is an AI platform for structured reflection on complex,
            divisive issues through principled disagreement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/debate-intro"
              className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105"
            >
              Start the Demo
              <Sparkles className="w-5 h-5 ml-2" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center border border-slate-700 text-slate-200 hover:bg-white/5 px-8 py-6 text-lg rounded-full transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* CHALLENGE SECTION */}
      <section className="py-24 px-6 bg-slate-950/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              The Challenge of Polarised Discourse
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-6" />
          </div>

          <div className="grid lg:grid-cols-[1.4fr,1fr] gap-10 items-start">
            {/* Text */}
            <div className="space-y-5 text-slate-200 text-base md:text-lg leading-relaxed">
              <p>
                Polarised disagreement on high-stakes issues like immigration,
                climate change, and identity politics strains democratic
                discourse and public wellbeing. Conversations often devolve into
                bad-faith attacks, or are avoided altogether.
              </p>
              <p>
                At the same time, AI is frequently used to intensify division,
                fuelling campaigns that entrench identities and trap people in
                ideological echo chambers. There are still very few scalable
                tools that help individuals safely explore their own views and
                those of others.
              </p>
              <p>
                The core problem isn't disagreement itself, but the lack of
                structured, reflective engagement with polarised topics.
              </p>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/5 border border-red-500/30 p-5 shadow-lg shadow-red-900/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Echo Chambers
                  </h3>
                </div>
                <p className="text-sm md:text-base text-slate-200">
                  Algorithms reinforce existing beliefs by repeatedly showing us
                  aligned content, limiting exposure to genuinely different
                  perspectives.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-yellow-400/30 p-5 shadow-lg shadow-yellow-900/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/15 flex items-center justify-center">
                    <MessageCircleOff className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Avoidance
                  </h3>
                </div>
                <p className="text-sm md:text-base text-slate-200">
                  Many people avoid difficult conversations entirely because
                  they worry about conflict, social fallout, or simply don't
                  know where to start.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-blue-500/30 p-5 shadow-lg shadow-blue-900/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Polarisation
                  </h3>
                </div>
                <p className="text-sm md:text-base text-slate-200">
                  Extreme positions tend to dominate public discourse, crowding
                  out nuance and making it harder to recognise shared ground.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="py-24 px-6 bg-slate-950/80 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              How CONSIDER Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A three-stage process for structured reflection and principled
              disagreement.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto mt-4" />
          </div>

          {/* Stage bar - Clickable */}
          <div className="flex items-center justify-center gap-4 mb-14 max-w-xl mx-auto">
            {stages.map((stage, index) => (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-110 ${stage.buttonBg}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 font-semibold text-white ${
                      activeStage === stage.id
                        ? `${stage.circleBg} shadow-lg ${
                            stage.id === 1
                              ? "shadow-cyan-500/50"
                              : stage.id === 2
                              ? "shadow-blue-500/50"
                              : "shadow-purple-500/50"
                          }`
                        : "bg-slate-700"
                    }`}
                  >
                    {stage.id}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium transition-colors duration-200 ${
                      activeStage === stage.id
                        ? "text-white"
                        : "text-slate-300"
                    }`}
                  >
                    {stage.label}
                  </span>
                </button>

                {index < stages.length - 1 && (
                  <div className="h-[2px] flex-1 bg-slate-700" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Cards - Show only active stage */}
          <div className="grid md:grid-cols-3 gap-6">
            {stages.map((stage) => {
              const IconComponent = stage.icon;
              return (
                <div
                  key={stage.id}
                  className={`rounded-2xl bg-white/5 border p-6 text-center shadow-lg transition-all duration-300 ${
                    activeStage === stage.id
                      ? `${stage.cardBg} ${stage.cardGlow} scale-105`
                      : "border-white/10 shadow-black/30 opacity-40"
                  }`}
                >
                  {stage.id === 3 && (
                    <div className="inline-block mb-3 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50">
                      <span className="text-xs font-semibold text-yellow-300">Coming Soon</span>
                    </div>
                  )}
                  <div className="mb-3 flex justify-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        activeStage === stage.id
                          ? stage.iconBg
                          : "bg-slate-700/30"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 transition-all duration-200 ${
                          activeStage === stage.id
                            ? stage.iconColor
                            : "text-slate-500"
                        }`}
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERDISCIPLINARY APPROACH */}
      <section className="py-24 px-6 bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Our Interdisciplinary Approach
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Combining philosophy, psychology, and AI research to support
              constructive disagreement.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/5 border border-indigo-400/40 p-6 text-center shadow-lg shadow-indigo-900/30">
              <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <Atom className="w-7 h-7 text-indigo-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Philosophy
              </h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                We draw on Mill's trident and other normative frameworks to
                structure disagreement in ways that respect both truth and
                pluralism.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-purple-400/40 p-6 text-center shadow-lg shadow-purple-900/30">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-7 h-7 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Psychology
              </h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                We draw on psychological insights to create environments where people feel safe exploring different viewpoints and reflecting on their own beliefs without defensiveness.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-cyan-400/40 p-6 text-center shadow-lg shadow-cyan-900/30">
              <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-7 h-7 text-cyan-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI research
              </h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                We design and evaluate models that can generate nuanced,
                value-aware counterarguments, rather than simply maximising
                persuasion or engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-white/5 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white font-semibold">CONSIDER</span>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CONSIDER project. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
