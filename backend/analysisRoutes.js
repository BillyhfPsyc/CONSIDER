const express = require("express");
const router = express.Router();
const database = require("./connect.js");
const {
  buildPhilosophicalPrompt,
  buildExtractorPrompt,
} = require("./analysisPrompts");

const OpenAI = require("openai");

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PHILOSOPHICAL_MODEL = "anthropic/claude-sonnet-4-5";
const EXTRACTOR_MODEL = "openai/gpt-4o";

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
  } catch {
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        return JSON.parse(text.slice(start, end + 1));
      }
      return null;
    } catch {
      return null;
    }
  }
}

async function callModel(model, prompt, useJsonFormat = true) {
  const params = {
    model,
    messages: [{ role: "system", content: prompt }],
    temperature: 0.3,
  };

  if (useJsonFormat) {
    params.response_format = { type: "json_object" };
  }

  const completion = await openrouter.chat.completions.create(params);
  return completion.choices[0].message.content;
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

    const [history, latestProfileArr] = await Promise.all([
      db.collection("Interactions")
        .find({ conversationId, context: "debate" })
        .sort({ timestamp: 1 })
        .toArray(),
      db.collection("profiles")
        .find({ conversationId })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray(),
    ]);

    if (!history.length) {
      return res.status(404).json({ error: "No conversation found for this conversationId." });
    }

    const transcript = formatTranscript(history);
    const profile = latestProfileArr[0]?.profile || "No AI profile found.";
    const resolvedTopic = topic || history[0]?.topic || "Unknown topic";
    const resolvedSummary = summary || "No user summary provided.";

    const [philosophicalText, extractorText] = await Promise.all([
      callModel(
        PHILOSOPHICAL_MODEL,
        buildPhilosophicalPrompt({ topic: resolvedTopic, summary: resolvedSummary, profile, transcript }),
        false
      ),
      callModel(
        EXTRACTOR_MODEL,
        buildExtractorPrompt({ topic: resolvedTopic, summary: resolvedSummary, transcript })
      ),
    ]);

    console.log("🧠 PHILOSOPHICAL:\n", philosophicalText);
    console.log("📋 EXTRACTOR:\n", extractorText);

    const philosophical = safeParseAnalysis(philosophicalText);
    const extracted = safeParseAnalysis(extractorText);

    if (!philosophical || !extracted) {
      console.error("❌ One or more agent outputs failed to parse.");
      return res.status(500).json({ error: "One or more analysis agents returned invalid JSON." });
    }

    const analysis = { ...philosophical, ...extracted };

    return res.json({ analysis });
  } catch (err) {
    console.error("Error in /analyze-conversation:", err);
    return res.status(500).json({ error: "Failed to analyze conversation." });
  }
});

module.exports = router;
