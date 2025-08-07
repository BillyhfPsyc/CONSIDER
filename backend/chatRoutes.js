// This file defines what should happen when the frontend sends a chat message to the server.
// When a POST request is made to /chat, this route:
// - checks that all the needed information (like message, context, and conversation ID) is included,
// - connects to the MongoDB database and saves the user's message,
// - retrieves the full conversation history so far,
// - builds a prompt for the chatbot, combining system instructions and the conversation,
// - optionally adds extra information like the topic and the user's position (if it's a debate),
// - sends everything to the OpenAI GPT model to generate a reply,
// - saves that reply to the database too,
// - and finally sends the reply back to the frontend.
// 
// This is the main logic that makes the chatbot feel like it's holding a real conversation.


// chatRoutes.js
const express = require("express");
const router = express.Router();
const database = require("./connect.js");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
      systemPrompt
    } = req.body;

    // 🧱 Required field validation
    if (!conversationId) return res.status(400).json({ error: "`conversationId` is required." });
    if (!userMessage) return res.status(400).json({ error: "`message` is required." });
    if (!context || !['position_clarification', 'debate'].includes(context)) {
      return res.status(400).json({ error: "`context` must be 'position_clarification' or 'debate'." });
    }
    if (!systemPrompt) return res.status(400).json({ error: "`systemPrompt` is required." });

    // 🧠 Connect to DB
    const db = database.getDB();
    if (!db) return res.status(500).json({ error: "Database not initialized." });
    await db.command({ ping: 1 });
    console.log("✅ MongoDB ping successful");

    // 💾 Save user message
    console.log("🔍 Inserting user message:", userMessage);
    const userResult = await db.collection("messages").insertOne({
      conversationId,
      role: "user",
      content: userMessage,
      topic: topic || null,
      context,
      timestamp: new Date()
    });
    console.log("✅ User message saved with _id:", userResult.insertedId);

    // 📜 Load conversation history
    const history = await db.collection("messages")
      .find({ conversationId })
      .sort({ timestamp: 1 })
      .limit(20)
      .toArray();

    // 🧠 Prepare prompt
    const systemPromptMessage = { role: "system", content: systemPrompt };
    let messagesForAI = [systemPromptMessage, ...history.map(msg => ({ role: msg.role, content: msg.content }))];

    // ✍️ Inject topic + user position if debate is just starting
    if (context === 'debate' && history.length <= 2 && topic && positionSummary) {
      messagesForAI.splice(1, 0, { role: 'user', content: `Topic: ${topic}` });
      messagesForAI.splice(2, 0, { role: 'user', content: `User position: ${positionSummary}` });
    }

    // 🤖 Generate response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // experiment with different models.
      messages: messagesForAI
    });
    const assistantReply = completion.choices[0].message.content;

    // 💾 Save assistant reply
    console.log("🔍 Inserting assistant reply:", assistantReply);
    const botResult = await db.collection("messages").insertOne({
      conversationId,
      role: "assistant",
      content: assistantReply,
      topic: topic || null,
      context,
      timestamp: new Date()
    });
    console.log("✅ Assistant reply saved with _id:", botResult.insertedId);

    return res.json({ reply: assistantReply });
  } catch (err) {
    console.error("❌ Error in /chat route:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create post route for generating a profile
/**
 * POST /generate-profile
 * Generates a fictional profile that disagrees with the user's position.
 * Expects: { topic, positionSummary }
 * Returns: { profile: "..." }
 */
/**
 * POST /generate-profile
 * Generates a fictional profile that disagrees with the user's position.
 * Expects: { topic, positionSummary }
 * Returns: { profile: "..." }
 */
router.post("/generate-profile", async (req, res) => {
  try {
    const {
      conversationId,
      topic,
      positionSummary: summary,
      systemPrompt,
      message,
      context
    } = req.body;

    // ✅ Validate input
    if (!conversationId || !topic || !summary || !systemPrompt || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // ✅ Call OpenAI with provided prompt + message
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

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

    // (Optional) save to DB here

    res.json({ profile });

  } catch (err) {
    console.error("❌ Error in /generate-profile:", err);
    res.status(500).json({ error: "Failed to generate profile." });
  }
});


module.exports = router;
