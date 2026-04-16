function buildPhilosophicalPrompt({ topic, summary, profile, transcript }) {
  return `
You are analyzing a structured disagreement conversation from the CONSIDER platform.

Produce a careful philosophical analysis of the user's perspective and the AI's perspective.

You must return valid JSON only. No markdown, no backticks, no text before or after the JSON.

Be charitable and grounded in what the transcript actually shows. Do not invent claims the user did not make. If something is unclear, reflect that uncertainty in your wording.

Return JSON in exactly this shape:

{
  "userProfile": {
    "label": "short descriptive label for the user's position",
    "summary": "2-4 sentence summary of the user's worldview and stance as shown in the conversation",
    "coreValues": ["value 1", "value 2", "value 3"],
    "reasoningStyle": "brief description of how they argue — e.g. appeals to evidence, lived experience, moral principle, intuition"
  },
  "aiProfile": {
    "label": "short descriptive label for the AI's position",
    "summary": "2-4 sentence summary of the AI's worldview and stance",
    "coreValues": ["value 1", "value 2", "value 3"],
    "reasoningStyle": "brief description"
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
      "relevance": "high | moderate | low | absent",
      "explanation": "Cite specific things the user said that draw on concern for suffering or wellbeing. If this dimension did not feature, write: 'This moral consideration did not feature in the conversation.'"
    },
    {
      "dimension": "Fairness / Reciprocity",
      "relevance": "high | moderate | low | absent",
      "explanation": "Cite specific things the user said relating to justice, rights, equality, or fair treatment. If absent, say so explicitly."
    },
    {
      "dimension": "Liberty / Oppression",
      "relevance": "high | moderate | low | absent",
      "explanation": "Cite specific things the user said about freedom, autonomy, coercion, or the right to self-determination. If absent, say so explicitly."
    },
    {
      "dimension": "Loyalty / Betrayal",
      "relevance": "high | moderate | low | absent",
      "explanation": "Cite specific things the user said about group identity, solidarity, national belonging, or in-group obligations. If absent, say so explicitly."
    },
    {
      "dimension": "Authority / Tradition",
      "relevance": "high | moderate | low | absent",
      "explanation": "Cite specific things the user said about legitimate hierarchy, institutional authority, tradition, or social order. If absent, say so explicitly."
    },
    {
      "dimension": "Sanctity / Purity",
      "relevance": "high | moderate | low | absent",
      "explanation": "Cite specific things the user said about human dignity, the sacred, the natural, or moral contamination. If absent, say so explicitly."
    }
  ],
  "epistemicHumility": {
    "score": 1,
    "explanation": "1-3 sentences. Did the user acknowledge uncertainty, qualify their claims, or show any willingness to update during the conversation? Score 1-10: 1 = rigid and unqualified throughout, 10 = consistently open, uncertain, and genuinely responsive to counterarguments."
  },
  "overtonPosition": {
    "description": "2-4 sentences. Where does the user's position sit relative to mainstream public discourse and, where relevant, academic or policy debate on this topic? Avoid partisan labels. Be specific about what makes this position mainstream, marginal, or somewhere in between."
  }
}

Scoring rules:
- epistemicHumility score must be an integer from 1 to 10.

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
- "potentialAgreements": points where agreement seems likely or partially implied, but was not directly stated

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
      "summary": "1-2 sentences on why this looks like a likely or partial agreement"
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

function buildDynamicsPrompt({ topic, transcript }) {
  return `
You are analyzing the conversational dynamics of a structured disagreement debate.

Return valid JSON only. No markdown, no backticks, no text before or after the JSON.

Return JSON in exactly this shape:

{
  "conversationDynamics": {
    "tone": "brief description of the overall emotional and rhetorical tone — e.g. calm and analytical, tense, dismissive, exploratory",
    "movement": "did either side shift, clarify, soften, harden, or remain static across the conversation?",
    "notes": "1-3 sentences interpreting the character of the exchange as a whole"
  }
}

Input material:

TOPIC:
${topic || "Unknown topic"}

TRANSCRIPT:
${transcript || "No transcript provided."}
`.trim();
}

module.exports = { buildPhilosophicalPrompt, buildExtractorPrompt, buildDynamicsPrompt };
