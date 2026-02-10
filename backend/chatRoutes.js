// chatRoutes.js
// Could make this cleaner so I can more easily add models?

const express = require("express");
const router = express.Router();
const database = require("./connect.js");

const OpenAI = require("openai");
const Together = require("together-ai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

// 🔧 Choose provider ONCE here: "openai" or "together"
const PROVIDER = process.env.LLM_PROVIDER || "openai";

// Default models for each provider
const OPENAI_MODEL = "gpt-4o-mini"; // adjust if you like
const TOGETHER_MODEL = "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8";

/**
 * POST /chat
 * Handles full chat flow for both 'position_clarification' and 'debate' contexts.
 */
router.post("/chat", async (req, res) => {
  try {
    console.log("⚡️ [chatRoutes] Received /chat request:", req.body);
    const {
      conversationId,
      message: userMessage,
      topic,
      context,
      positionSummary,
      systemPrompt,
      disagreeability // NEW
    } = req.body;

    // 🧱 Required field validation
    if (!conversationId) {
      return res.status(400).json({ error: "`conversationId` is required." });
    }
    if (!userMessage) {
      return res.status(400).json({ error: "`message` is required." });
    }
    if (!context || !["position_clarification", "debate"].includes(context)) {
      return res
        .status(400)
        .json({ error: "`context` must be 'position_clarification' or 'debate'." });
    }
    if (!systemPrompt) {
      return res.status(400).json({ error: "`systemPrompt` is required." });
    }

    // 🧠 Connect to DB
    const db = database.getDB();
    if (!db) return res.status(500).json({ error: "Database not initialized." });
    await db.command({ ping: 1 });
    console.log("✅ MongoDB ping successful");

    // 💾 Save user message
    console.log("🔍 Inserting user message:", userMessage);
    const userResult = await db.collection("Interactions").insertOne({
      conversationId,
      role: "user",
      content: userMessage,
      topic: topic || null,
      context,
      disagreeability: Number.isFinite(Number(disagreeability)) ? Number(disagreeability) : null,
      timestamp: new Date()
    });
    console.log("✅ User message saved with _id:", userResult.insertedId);

    // 📜 Load conversation history
    const history = await db
      .collection("Interactions")
      .find({ conversationId })
      .sort({ timestamp: 1 })
      .limit(60) // limit to last 40 messages to control token usage
      .toArray();

    // 🧠 Prepare prompt
    const systemPromptMessage = { role: "system", content: systemPrompt };
    let messagesForAI = [
      systemPromptMessage,
      ...history.map((msg) => ({ role: msg.role, content: msg.content }))
    ];

    // ✍️ Inject topic + user position if debate is just starting
    if (context === "debate" && history.length <= 2 && topic && positionSummary) {
      messagesForAI.splice(1, 0, { role: "user", content: `Topic: ${topic}` });
      messagesForAI.splice(2, 0, {
        role: "user",
        content: `User position: ${positionSummary}`
      });
    }

    // 🤖 Generate response from chosen provider
    let assistantReply = "";

    if (PROVIDER === "together") {
      console.log(`🤖 Using Together model: ${TOGETHER_MODEL}`);
      const completion = await together.chat.completions.create({
        model: TOGETHER_MODEL,
        messages: messagesForAI
      });
      assistantReply = completion.choices[0].message.content;
    } else {
      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: messagesForAI
      });
      assistantReply = completion.choices[0].message.content;
    }

    // 💾 Save assistant reply
    console.log("🔍 Inserting assistant reply:", assistantReply);
    const botResult = await db.collection("Interactions").insertOne({
      conversationId,
      role: "assistant",
      content: assistantReply,
      topic: topic || null,
      context,
      disagreeability: Number.isFinite(Number(disagreeability)) ? Number(disagreeability) : null,
      timestamp: new Date()
    });
    console.log("✅ Assistant reply saved with _id:", botResult.insertedId);

    return res.json({ reply: assistantReply });
  } catch (err) {
    console.error("❌ Error in /chat route:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /generate-profile
 * Generates a fictional profile that disagrees with the user's position.
 * Expects: { conversationId, topic, positionSummary, systemPrompt, message }
 * Returns: { profile: "..." }
 */
router.post("/generate-profile", async (req, res) => {
  try {
    const {
      conversationId,
      topic,
      positionSummary: summary,
      systemPrompt,
      message
    } = req.body;

    // ✅ Validate input
    if (!conversationId || !topic || !summary || !systemPrompt || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let completion;

    if (PROVIDER === "together") {
      completion = await together.chat.completions.create({
        model: TOGETHER_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      });
    } else {
      completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      });
    }

    const profile = completion.choices[0].message.content;
    console.log("🎭 Generated fictional profile:", profile);

    // ✅ Save the profile to the database
    const db = database.getDB();
    await db.collection("profiles").insertOne({
      conversationId,
      topic,
      positionSummary: summary,
      profile,
      timestamp: new Date()
    });
    console.log("✅ Profile saved to MongoDB");

    res.json({ profile });
  } catch (err) {
    console.error("❌ Error in /generate-profile:", err);
    res.status(500).json({ error: "Failed to generate profile." });
  }
});

module.exports = router;
