// src/CurrentPosition.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendPositionChat } from "./api";

function CurrentPosition() {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic;
  const topicLabel = topic?.label || "Unknown Topic";

  const [conversationId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Please describe your opinion on ${topicLabel}. Feel free to include your core related beliefs, why the topic is important to you, and other information that is important to your opinion. 
      If there's a specific area within this topic you want to discuss, mention this in your first message. `,
    },
  ]);
  const [input, setInput] = useState("");
  const [summaryReady, setSummaryReady] = useState(false);
  const [isUpdatingStance, setIsUpdatingStance] = useState(false);

  const chatBoxRef = useRef(null);
  const proceedRef = useRef(null);

  // Keep chat scrolled to bottom on new messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Scroll to proceed button once summary is ready
  useEffect(() => {
    if (summaryReady && proceedRef.current) {
      proceedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [summaryReady]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
      { sender: "bot", text: "Typing..." },
    ]);
    setInput("");

    try {
      const res = await sendPositionChat(conversationId, userText, topicLabel);
      const reply = res.data.reply;

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: reply },
      ]);

      if (reply.includes("__SUMMARY_COMPLETE__") || 
          reply.includes("SUMMARY_COMPLETE__") || 
          reply.includes("__SUMMARY_COMPLETE") || 
          reply.includes("SUMMARY_COMPLETE") 
      ) {
        setSummaryReady(true);
        setIsUpdatingStance(false);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleProceed = () => {
    // Find the LAST message with __SUMMARY_COMPLETE__ (most recent summary)
    let summaryMessage = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].text.includes("__SUMMARY_COMPLETE__")) {
        summaryMessage = messages[i].text
          .replace("__SUMMARY_COMPLETE__", "")
          .trim();
        break;
      }
    }

    navigate("/play", {
      state: { summary: summaryMessage, topic: topicLabel, conversationId },
    });
  };

  const handleUpdateStance = () => {
    setIsUpdatingStance(true);
    setSummaryReady(false);
  };

  return (
    <>
      <div className="px-6 py-10 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              SUMMARY PHASE
            </h1>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed">
              Here, you’ll have a short conversation with an AI that is trying
              to understand your opinion on{" "}
              <span className="font-semibold text-cyan-300">
                {topicLabel}
              </span>
              . Once it understands your view, it will ask you to confirm it.
              When you approve the summary, a button will appear so you can
              continue to the main conversation.
            </p>
          </div>

          {/* Chat box */}
          <div
            ref={chatBoxRef}
            className="mt-2 h-80 md:h-96 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:p-5 shadow-xl shadow-black/40 space-y-3"
          >
            <div className={summaryReady && !isUpdatingStance ? "opacity-50" : "opacity-100"}>
              {messages.slice(0, -1).map((msg, index) => {
                const isBot = msg.sender === "bot";
                const cleanText = isBot
                  ? msg.text.replace("__SUMMARY_COMPLETE__", "").trim()
                  : msg.text;

                return (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      isBot ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isBot && (
                      <div className="flex-shrink-0">
                        <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                          <img
                            src="/robot.png"
                            alt="Bot"
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm md:text-base leading-relaxed ${
                        isBot
                          ? "bg-slate-800/90 text-slate-50"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white ml-auto"
                      }`}
                    >
                      {cleanText}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Latest message (summary) - always visible */}
            {messages.length > 0 && (
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                    <img
                      src="/robot.png"
                      alt="Bot"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                </div>

                <div className="max-w-[80%] rounded-2xl px-3 py-2 text-sm md:text-base leading-relaxed bg-slate-800/90 text-slate-50">
                  {messages[messages.length - 1].text
                    .replace("__SUMMARY_COMPLETE__", "")
                    .trim()}
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div
            className={`flex items-end gap-3 pt-2 transition-opacity ${
              summaryReady && !isUpdatingStance ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <textarea
              className="flex-1 min-h-[3rem] max-h-40 rounded-2xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm md:text-base text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response here..."
              rows={1}
              disabled={summaryReady && !isUpdatingStance}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={summaryReady && !isUpdatingStance}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm md:text-base font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-transform transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Proceed and Update buttons */}
      {summaryReady && (
        <div className="px-6 pb-12" ref={proceedRef}>
          <div className="max-w-4xl mx-auto flex justify-center gap-4">
            <button
              type="button"
              onClick={handleUpdateStance}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-transform transition-shadow duration-200"
            >
              I want to update my stance
            </button>
            <button
              type="button"
              onClick={handleProceed}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-transform transition-shadow duration-200 animate-pulse"
            >
              I'm happy with the summary — proceed to conversation
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CurrentPosition;
