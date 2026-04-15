const express = require("express");
const router = express.Router();
const database = require("./connect.js");
const { buildAnalysisPrompt } = require("./analysisPrompt");

const OpenAI = require("openai");
const Together = require("together-ai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

const PROVIDER = process.env.LLM_PROVIDER || "openai";
const OPENAI_MODEL = "gpt-4o-mini";
const TOGETHER_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo";

function formatTranscript(history) {
  return history
    .map((msg) => {
      const speaker = msg.role === "assistant" ? "AI" : "User";
      return `${speaker}: ${msg.content}`;
    })
    .join("\n\n");
}

function safeParseAnalysis(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

router.post("/analyze-conversation", async (req, res) => {
  try {
    const { conversationId, topic, summary } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: "`conversationId` is required." });
    }

    const db = database.getDB();
    if (!db) {
      return res.status(500).json({ error: "Database not initialized." });
    }

    await db.command({ ping: 1 });

    const history = await db
      .collection("Interactions")
      .find({ conversationId })
      .sort({ timestamp: 1 })
      .toArray();

    if (!history.length) {
      return res.status(404).json({ error: "No conversation found for this conversationId." });
    }

    const latestProfile = await db
      .collection("profiles")
      .find({ conversationId })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    const transcript = formatTranscript(history);
    const profile = latestProfile[0]?.profile || "No AI profile found.";

    const prompt = buildAnalysisPrompt({
      topic: topic || history[0]?.topic || "Unknown topic",
      summary: summary || "No user summary provided.",
      profile,
      transcript,
    });

    let analysisText = "";

    if (PROVIDER === "together") {
      const completion = await together.chat.completions.create({
        model: TOGETHER_MODEL,
        messages: [{ role: "system", content: prompt }],
      });
      analysisText = completion.choices[0].message.content;
    } else {
      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: "system", content: prompt }],
      });
      analysisText = completion.choices[0].message.content;
    }

    const analysis = safeParseAnalysis(analysisText);

    if (!analysis) {
      return res.status(500).json({
        error: "Analysis model returned invalid JSON.",
        raw: analysisText,
      });
    }

    return res.json({ analysis });
  } catch (err) {
    console.error("Error in /analyze-conversation:", err);
    return res.status(500).json({ error: "Failed to analyze conversation." });
  }
});

module.exports = router;