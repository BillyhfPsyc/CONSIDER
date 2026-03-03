import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, MessageSquare } from "lucide-react";
import ShiftLogo from "./assets/CONSIDER demo image.png";

export default function Layout({ children, timerDisplay }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 ${
          isHome ? "bg-transparent" : "bg-slate-950/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 select-none">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-cyan-400 to-blue-500 p-2.5 rounded-xl">
                <img
                  src={ShiftLogo}
                  alt=""
                  className="w-20 h-auto opacity-80"
                />
              </div>
            </div>

            <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              CONSIDER
            </span>
          </div>

          {/* Timer display in center */}
          {timerDisplay && (
            <div className="flex flex-col items-center gap-1">
              <div className="text-sm font-medium text-cyan-400 font-mono">
                {timerDisplay}
              </div>
              <div className="text-xs text-slate-400 whitespace-nowrap">
                10 minute limit
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Link
              to="/"
              onClick={() => {
                sessionStorage.removeItem("conversationId");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                isHome
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </Link>

            {isHome ? (
              <Link
                to="/debate-intro"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
              >
                <MessageSquare className="w-4 h-4" />
                Start
              </Link>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-500 cursor-not-allowed opacity-60">
                <MessageSquare className="w-4 h-4" />
                Start
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="relative pt-32">{children}</main>
    </div>
  );
}
