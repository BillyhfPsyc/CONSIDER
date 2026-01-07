import React from "react";
import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";

export default function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 max-w-3xl ${
        isUser ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-slate-700 to-slate-800"
            : "bg-gradient-to-br from-cyan-500 to-blue-500"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-slate-300" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`flex-1 px-5 py-3.5 rounded-2xl ${
          isUser
            ? "bg-gradient-to-br from-slate-800 to-slate-800/80 border border-slate-700/50"
            : "bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
        }`}
      >
        <p
          className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
            isUser ? "text-slate-200" : "text-slate-300"
          }`}
        >
          {message}
        </p>
      </div>
    </motion.div>
  );
}
