const express = require("express");
const router = express.Router();
const database = require("./connect.js");

const OpenAI = require("openai");
const Together = require("together-ai");
const { SUMMARY_PROMPT, DEBATE_PROMPT, PROFILE_PROMPT } = require("./prompts");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

const PROVIDER = process.env.LLM_PROVIDER || "openai";
const OPENAI_MODEL = "gpt-4o-mini";
const TOGETHER_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo";


router.post("/chat", async (req, res) => {
  try {
    console.log("⚡️ [chatRoutes] Received /chat request:", req.body);
    const {
      conversationId,
      message: userMessage,
      topic,
      context,
      positionSummary,
      disagreeability,
      specificFocus
    } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: "`conversationId` is required." });
    }
    if (!userMessage) {
      return res.status(400).json({ error: "`message` is required." });
    }
    if (!context || !["position_clarification", "debate"].includes(context)) {
      return res.status(400).json({ error: "`context` must be 'position_clarification' or 'debate'." });
    }

    const db = database.getDB();
    if (!db) return res.status(500).json({ error: "Database not initialized." });
    await db.command({ ping: 1 });
    console.log("✅ MongoDB ping successful");

    // Build system prompt server-side
    let systemPrompt;
    if (context === "position_clarification") {
      systemPrompt = SUMMARY_PROMPT(topic, specificFocus);
    } else {
      const latestProfileArr = await db.collection("profiles")
        .find({ conversationId })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();
      const profile = latestProfileArr[0]?.profile || "";
      systemPrompt = DEBATE_PROMPT(topic, profile, positionSummary, disagreeability, specificFocus);
    }

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

    const history = await db
      .collection("Interactions")
      .find({ conversationId })
      .sort({ timestamp: 1 })
      .limit(60)
      .toArray();

    let messagesForAI = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({ role: msg.role, content: msg.content }))
    ];

    if (context === "debate" && history.length <= 2 && topic && positionSummary) {
      messagesForAI.splice(1, 0, { role: "user", content: `Topic: ${topic}` });
      messagesForAI.splice(2, 0, { role: "user", content: `User position: ${positionSummary}` });
    }

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


router.post("/generate-profile", async (req, res) => {
  try {
    const {
      conversationId,
      topic,
      positionSummary: summary,
      specificFocus
    } = req.body;

    if (!conversationId || !topic || !summary) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const systemPrompt = PROFILE_PROMPT(topic, summary, undefined, specificFocus);
    const message = "Generate a fictional profile of someone who disagrees with me.";

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
