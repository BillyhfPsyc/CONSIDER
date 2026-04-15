function buildAnalysisPrompt({ topic, summary, profile, transcript }) {
    return `
  You are analyzing a structured disagreement conversation from the CONSIDER app.
  
  Your job is to analyze the user's perspective and the AI opponent's perspective based on:
  1. the user's position summary
  2. the AI's generated disagreement profile
  3. the full conversation transcript
  
  You must return valid JSON only.
  Do not include markdown.
  Do not include backticks.
  Do not include any text before or after the JSON.
  
  The goal is to produce a careful, readable post-conversation analysis.
  
  Important instructions:
  - Be charitable and accurate.
  - Do not exaggerate certainty.
  - Base claims on the provided material only.
  - Distinguish direct agreement from likely or partial agreement.
  - Focus on substantive disagreement, not just wording differences.
  - Keep the writing clear and concise.
  - Do not invent facts that are not supported by the transcript.
  - If something is unclear, reflect that uncertainty in the wording.
  - The "scores" are model-estimated summary judgments, not objective scientific measurements.
  - For "polarisationEstimate", estimate how ideologically rigid, one-sided, or positionally distant the user's stance appears within the bounds of ordinary public disagreement on this topic. This is an estimate, not a population-backed percentile.
  
  Return JSON in exactly this shape:
  
  {
    "userProfile": {
      "label": "short label",
      "summary": "2-4 sentence summary of the user's worldview and stance",
      "coreValues": ["value 1", "value 2", "value 3"],
      "reasoningStyle": "brief description"
    },
    "aiProfile": {
      "label": "short label",
      "summary": "2-4 sentence summary of the AI's worldview and stance",
      "coreValues": ["value 1", "value 2", "value 3"],
      "reasoningStyle": "brief description"
    },
    "scorecard": {
      "polarisationEstimate": {
        "score": 1,
        "explanation": "1-3 sentence explanation"
      },
      "disagreementDepth": {
        "score": 1,
        "explanation": "1-3 sentence explanation"
      }
    },
    "keyDisagreements": [
      {
        "title": "short disagreement title",
        "summary": "2-3 sentence explanation of the disagreement"
      }
    ],
    "keyAgreements": [
      {
        "title": "short agreement title",
        "summary": "1-2 sentence explanation of direct agreement"
      }
    ],
    "potentialAgreements": [
      {
        "title": "short possible agreement title",
        "summary": "1-2 sentence explanation of likely or partial agreement"
      }
    ],
    "conversationDynamics": {
      "tone": "brief description",
      "movement": "brief description of whether either side shifted, clarified, softened, hardened, or remained stable",
      "notes": "1-3 sentence high-level interpretation of how the exchange unfolded"
    }
  }
  
  Scoring rules:
  - All scores must be integers from 1 to 10.
  - Use the full range only when justified.
  - A score of 1 means very low.
  - A score of 10 means very high.
  - "polarisationEstimate" should reflect how rigid, absolute, uncompromising, or far-from-moderate the user's position appears within this conversation.
  - "disagreementDepth" should reflect how deep the conflict is between the two sides, not how hostile the tone is.
  
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
  
  module.exports = { buildAnalysisPrompt };