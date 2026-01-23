import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD || "test-password";

export default function Access() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === SITE_PASSWORD) {
      // localStorage.setItem("shift_access_granted", "true"); // this makes users stay logged in across sessions.
      sessionStorage.setItem("consider_access_granted", "true"); // this makes users put in password after each session.
      setError("");
      navigate("/"); // send them to the home page
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          CONSIDER Access
        </h1>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Enter the access code to continue to the site.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Access code"
            className="w-full px-4 py-3 rounded-2xl bg-slate-900/70 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-sm font-medium transition"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}