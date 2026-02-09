import React from "react";
import { useNavigate } from "react-router-dom";

const RVDs = [
  {
    label: "Immigration",
    description:
      "Should borders be open? What should immigration laws allow? Who should be allowed into which countries?",
    tag: "Human Rights",
  },
  {
    label: "Abortion",
    description:
      "When does moral status begin, and should abortion be legally or morally permitted?",
    tag: "Human Rights",
  },
  {
    label: "Drug Legalisation",
    description:
      "Should drugs be legalised to reduce harm, or banned to protect society?",
    tag: "Public Health",
  },
  {
    label: "Veganism",
    description: "Should we eat animal products?",
    tag: "Environment",
  },
  {
    label: "Having Children",
    description:
      "Should people be allowed to have as many children as they please?",
    tag: "Environment",
  },
  {
    label: "Environment–Economy trade-offs",
    description:
      "Should environmental concerns trump economic concerns? Or vice-versa?",
    tag: "Environment",
  },
  {
    label: "War",
    description:
      "Are wars ever justified, given their effect on civilians? When?",
    tag: "Human Rights",
  },
  {
    label: "Euthanasia",
    description: "Should people be free to choose to die?",
    tag: "Human Rights",
  },
  {
    label: "Transgender Issues",
    description:
      "Should there be trans bathrooms? Should trans youth have access to gender-affirming surgeries?",
    tag: "Human Rights",
  },
  {
    label: "Misgendering",
    description: "Should misgendering be criminal?",
    tag: "Human Rights",
  },
];

export default function RVDSelect() {
  const navigate = useNavigate();

  const handleClick = (rvd) => {
    navigate("/toggle", { state: { topic: rvd } });
  };

  return (
    <div className="px-6 py-12 md:py-20">
      <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Choose your topic
        </h1>

        <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-6" />

        <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
          Click on the topic that you would like to discuss. It should be
          an important topic you care about deeply and already have an
          opinion on. Hover over a topic to see a short description.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-4">
        {RVDs.map((rvd, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(rvd)}
            className="group relative flex w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 px-6 py-6 text-center shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-transform transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {/* Main label */}
            <span className="text-xl font-semibold text-white">
              {rvd.label}
            </span>

            {/* Hover description */}
            <span
              className="
                mt-0 max-h-0 opacity-0
                text-sm text-cyan-50/95
                overflow-hidden
                transition-all duration-300
                group-hover:opacity-100 group-hover:mt-3 group-hover:max-h-40
              "
            >
              {rvd.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
