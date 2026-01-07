import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function ChatInput({ onSend, isLoading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || isLoading) return;
    onSend(text);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-3 p-2 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 min-h-[52px] max-h-[200px] px-4 py-3.5 bg-transparent border-0 resize-none text-slate-200 placeholder:text-slate-500 focus:outline-none text-[15px] leading-relaxed"
        />

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="h-11 w-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-500/20 flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </form>
  );
}
