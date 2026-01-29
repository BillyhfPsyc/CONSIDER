// src/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { sendDebateChat, createProfile } from "./api";
import ChatInput from "./components/chat/ChatInput.jsx";
import MessageBubble from "./components/chat/MessageBubble.jsx";

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();

  const passedConversationId = location.state?.conversationId;
  const summary = location.state?.summary;
  const topic = location.state?.topic;
  const disagreeability = Number(sessionStorage.getItem("disagreeability") ?? 80); // is this in the correct place??


  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // total time for discussion
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const hasWarned = useRef(false);

  const hasInitialized = useRef(false);
  const hasSentOpening = useRef(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Hard redirect to results after 5 minutes
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/results");
    }, 5 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

    // One-minute warning popup (shows for 5 seconds)
    useEffect(() => {
      if (timeLeft === 60 && !hasWarned.current) {
        hasWarned.current = true;
        setShowTimeWarning(true);
  
        const t = setTimeout(() => setShowTimeWarning(false), 5000);
        return () => clearTimeout(t);
      }
    }, [timeLeft]);

  // Setup conversation + profile + bot opener
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!summary || !topic) {
      console.warn("Missing topic or summary — redirecting to homepage");
      navigate("/");
      return;
    }

    const startDebate = async (convId) => {
      try {
        // 1) Generate opposing profile
        const res = await createProfile(convId, topic, summary);
        const generatedProfile = res.data.profile;
        setProfile(generatedProfile);
        console.log("✅ Profile generated:", generatedProfile);

        // 2) Bot speaks first (only once)
        if (!hasSentOpening.current) {
          hasSentOpening.current = true;
          setIsLoading(true);

          const openerInstruction =
            "Start the conversation. Begin with a short greeting (for example: 'Hi' or 'Hey'), clearly state that you disagree with the user's position, and why.";

          const openerRes = await sendDebateChat(
            convId,
            openerInstruction,
            topic,
            summary,
            generatedProfile,
            disagreeability
          );

          const openerReply = openerRes.data.reply;

          // Show only the bot opener in the UI
          setMessages([{ sender: "bot", text: openerReply }]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("❌ Failed to generate profile / opener:", err);
        setIsLoading(false);
      }
    };

    if (passedConversationId) {
      setConversationId(passedConversationId);
      startDebate(passedConversationId);
    } else {
      const newId = crypto.randomUUID();
      sessionStorage.setItem("conversationId", newId);
      setConversationId(newId);
      startDebate(newId);
    }
  }, [navigate, passedConversationId, summary, topic]);

  const handleChooseAnotherTopic = () => {
    sessionStorage.removeItem("conversationId");
    sessionStorage.removeItem("disagreeability"); // optional but recommended
    navigate("/select-rvd");
  }; // new feature button
  
  const handleSendMessage = async (content) => {
    const text = content.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsLoading(true);

    try {
      const res = await sendDebateChat(conversationId, text, topic, summary, profile, disagreeability);
      const reply = res.data.reply;
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong while generating a reply.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndConversation = () => {
    navigate("/results");
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <AnimatePresence>
        {showTimeWarning && (
          <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: [1, 1.05, 1],
          }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 1,
          }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-400/40 px-6 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold"
          >
            ⏰ Less than one minute remaining — wrap up your final points!
          </motion.div>
        )}
      </AnimatePresence>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 min-h-[60vh]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 shadow-xl shadow-black/30 p-6 md:p-8 flex flex-col gap-6">
            {/* Header */}
            <div className="text-center mb-2 space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Discussion
              </h1>
              <p className="text-sm md:text-base text-slate-200 max-w-2xl mx-auto">
                You will now engage in a discussion with an AI that has an opposing opinion to you.
                Freely discuss the topic as you would with another person.
              </p>
              <p className="text-xs md:text-sm text-slate-400">
                Topic: <span className="font-semibold text-cyan-300">{topic}</span>
              </p>
              <p className="mt-2 font-semibold text-sm md:text-base text-slate-100">
                ⏳ Time remaining: <span className="font-mono">{minutes}:{seconds}</span>
              </p>
            </div>

            {/* Messages */}
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 md:py-16 flex-1 flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-cyan-400" />
                </div>

                <h2 className="text-2xl font-semibold text-white mb-3">
                  Starting the discussion...
                </h2>

                <p className="text-slate-400 max-w-md mx-auto mb-2">
                  The AI will begin in a moment.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col">
                <AnimatePresence mode="popLayout">
                  {messages.map((m, i) => (
                    <MessageBubble
                      key={`${m.sender}-${i}`}
                      message={m.text}
                      isUser={m.sender === "user"}
                    />
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 max-w-3xl"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                        <span
                          className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input + end button */}
      <div className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 space-y-3">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleChooseAnotherTopic}
              className="inline-flex items-center justify-center rounded-full bg-white/5 px-4 py-2 text-xs md:text-sm font-semibold text-slate-200 border border-white/15 hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              Choose another topic
            </button>

            <button
              type="button"
              onClick={handleEndConversation}
              className="inline-flex items-center justify-center rounded-full bg-white/5 px-4 py-2 text-xs md:text-sm font-semibold text-slate-200 border border-white/15 hover:bg-white/10 hover:border-cyan-400/60 transition-colors"
            >
              End conversation and see results
            </button> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
