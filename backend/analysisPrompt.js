function buildPhilosophicalPrompt({ topic, summary, profile, transcript }) {
  return `
You are analyzing a structured disagreement conversation from the CONSIDER platform.

Produce a careful philosophical analysis of the user's perspective and the AI's perspective.

You must return valid JSON only. No markdown, no backticks, no text before or after the JSON.

Be charitable and grounded in what the transcript actually shows. Do not invent claims the user did not make. If something is unclear, reflect that uncertainty in your wording.

Return JSON in exactly this shape:

{
  "userProfile": {
    "label": "short label capturing the user's core value identity — e.g. 'Harm reductionist' or 'Civil libertarian'",
    "summary": "2-4 sentence summary of the user's worldview and stance as shown in the conversation",
    "coreValues": ["specific moral value or commitment 1", "specific moral value or commitment 2", "specific moral value or commitment 3"],
    "reasoningStyle": "one short plain phrase under 8 words — e.g. 'Evidence-first, pragmatic' or 'Principle-led, intuition-grounded'"
  },
  "aiProfile": {
    "label": "short label capturing the AI's core value identity",
    "summary": "2-4 sentence summary of the AI's worldview and stance",
    "coreValues": ["specific moral value or commitment 1", "specific moral value or commitment 2", "specific moral value or commitment 3"],
    "reasoningStyle": "one short plain phrase under 8 words"
  },
  "disagreementType": {
    "classification": "empirical | principled | mixed",
    "explanation": "2-3 sentences. 'Empirical' means the disagreement is primarily about facts, evidence, or causal claims that are in principle resolvable by looking at evidence together. 'Principled' means the disagreement is primarily about values, rights, duties, or what matters morally — these cannot be resolved by evidence alone. 'Mixed' means both threads are present. Explain which applies and why, with reference to what was actually said."
  },
  "crux": {
    "claim": "The single most important factual or value claim underpinning the whole disagreement — the load-bearing assumption that, if changed, would change everything",
    "type": "factual | value",
    "explanation": "2-3 sentences. Why is this the crux? What would shift if this claim were accepted or rejected?"
  },
  "moralFoundations": [
    {
      "dimension": "Care / Harm",
      "score": 0,
      "explanation": "Cite specific things the user said that draw on concern for suffering or wellbeing. If this dimension did not feature, write: 'This moral consideration did not feature in the conversation.'"
    },
    {
      "dimension": "Fairness / Reciprocity",
      "score": 0,
      "explanation": "Cite specific things the user said relating to justice, rights, equality, or fair treatment. If absent, say so explicitly."
    },
    {
      "dimension": "Liberty / Oppression",
      "score": 0,
      "explanation": "Cite specific things the user said about freedom, autonomy, coercion, or the right to self-determination. If absent, say so explicitly."
    },
    {
      "dimension": "Loyalty / Betrayal",
      "score": 0,
      "explanation": "Cite specific things the user said about group identity, solidarity, national belonging, or in-group obligations. If absent, say so explicitly."
    },
    {
      "dimension": "Authority / Tradition",
      "score": 0,
      "explanation": "Cite specific things the user said about legitimate hierarchy, institutional authority, tradition, or social order. If absent, say so explicitly."
    },
    {
      "dimension": "Sanctity / Purity",
      "score": 0,
      "explanation": "Cite specific things the user said about human dignity, the sacred, the natural, or moral contamination. If absent, say so explicitly."
    }
  ],
  "epistemicHumility": {
    "score": 0,
    "explanation": "1-3 sentences assessing how openly the user held their position. Epistemic humility is about HOW you argue, not whether you changed your mind or agreed. A person can firmly disagree throughout and still score highly if they qualified their claims, acknowledged uncertainty, recognised the limits of their knowledge, or engaged seriously with the strongest counterarguments. Score 1-10: 1 = all claims stated with absolute certainty, counterarguments dismissed or ignored; 10 = claims consistently qualified, uncertainty acknowledged, opposing arguments engaged with seriously and charitably even while disagreeing."
  },
  "overtonPosition": {
    "description": "2-4 sentences. Where does the user's position sit relative to mainstream public discourse and, where relevant, academic or policy debate on this topic? Avoid partisan labels. Be specific about what makes this position mainstream, marginal, or somewhere in between."
  }
}

Scoring rules:
- epistemicHumility score must be an integer from 1 to 10.
- moralFoundations scores must be integers from 0 to 10.
- 0 = this dimension was entirely absent from the conversation.
- 1-3 = briefly implied or touched on.
- 4-6 = present and moderately relevant to the argument.
- 7-9 = significant and recurring in the user's reasoning.
- 10 = central — the argument largely rests on this foundation.
- Score the user's reasoning only, not the AI's.

Input material:

TOPIC:
${topic || "Unknown topic"}

USER SUMMARY:
${summary || "No user summary provided."}

AI PROFILE:
${profile || "No AI profile provided."}

TRANSCRIPT:
${transcript || "No transcript provided."}
`.trim();
}

function buildExtractorPrompt({ topic, summary, transcript }) {
  return `
You are extracting structured points of agreement and disagreement from a debate transcript.

Return valid JSON only. No markdown, no backticks, no text before or after the JSON.

Be specific and grounded. Base all points only on what was actually said in the transcript. Do not invent points that were not discussed.

Distinguish clearly:
- "keyAgreements": points that were directly and explicitly agreed upon by both sides during the conversation
- "potentialAgreements": points where both parties share a genuine underlying value or premise that could form the basis of real agreement — not just both acknowledging a fact, not vague platitudes, not restatements of the disagreement. If no genuine potential agreement exists, return an empty array. Do not invent one.

Return JSON in exactly this shape:

{
  "keyDisagreements": [
    {
      "title": "short title",
      "summary": "2-3 sentences describing the specific disagreement as it appeared in the conversation"
    }
  ],
  "keyAgreements": [
    {
      "title": "short title",
      "summary": "1-2 sentences on what was directly agreed"
    }
  ],
  "potentialAgreements": [
    {
      "title": "short title",
      "summary": "1-2 sentences on why this looks like a genuine shared value or premise"
    }
  ]
}

Aim for 3-5 keyDisagreements, 1-4 keyAgreements, 1-3 potentialAgreements. If there are genuinely fewer, return fewer. Do not pad with weak examples.

Input material:

TOPIC:
${topic || "Unknown topic"}

USER SUMMARY:
${summary || "No user summary provided."}

TRANSCRIPT:
${transcript || "No transcript provided."}
`.trim();
}

module.exports = { buildPhilosophicalPrompt, buildExtractorPrompt };
