import React, { useEffect, useRef, useState } from "react";
import { Send, Loader2, Mic, MicOff } from "lucide-react";

export default function ChatInput({ onSend, isLoading }) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const ignoreSpeechResultsRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-GB";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      if (ignoreSpeechResultsRef.current) return;

      let interimTranscript = "";
      let finalTranscript = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += `${transcript} `;
        } else {
          interimTranscript += transcript;
        }
      }

      finalTranscriptRef.current = finalTranscript;
      const combined = `${finalTranscript}${interimTranscript}`.trim();
      setMessage(combined);
    };

    recognition.onerror = () => {
      setIsListening(false);
      ignoreSpeechResultsRef.current = false;
    };

    recognition.onend = () => {
      setIsListening(false);
      ignoreSpeechResultsRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || isLoading) return;

    if (isListening && recognitionRef.current) {
      ignoreSpeechResultsRef.current = true;
      recognitionRef.current.stop();
    }

    onSend(text);
    setMessage("");
    finalTranscriptRef.current = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleListening = () => {
    if (!speechSupported || isLoading || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    finalTranscriptRef.current = message ? `${message.trim()} ` : "";
    ignoreSpeechResultsRef.current = false;
    recognitionRef.current.start();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-3 p-2 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            finalTranscriptRef.current = e.target.value;
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            speechSupported
              ? "Type your message or use the mic..."
              : "Type your message..."
          }
          disabled={isLoading}
          className="flex-1 min-h-[52px] max-h-[200px] px-4 py-3.5 bg-transparent border-0 resize-none text-slate-200 placeholder:text-slate-500 focus:outline-none text-[15px] leading-relaxed"
        />

        {speechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`h-14 w-14 rounded-xl transition-all duration-300 flex items-center justify-center border ${
              isListening
                ? "bg-red-500/20 border-red-400/50 text-red-300"
                : "bg-slate-700/60 border-slate-600/60 text-slate-200 hover:bg-slate-700"
            }`}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            title={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
        )}

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="h-14 w-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-500/20 flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Send className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-2 text-center">
        {speechSupported
          ? "Press Enter to send, Shift + Enter for new line, or use the mic"
          : "Press Enter to send, Shift + Enter for new line"}
      </p>
    </form>
  );
}