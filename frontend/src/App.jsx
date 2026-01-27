// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Chat from "./Chat.jsx";
import DebateIntro from "./DebateIntro.jsx";
import RVDSelect from "./RVDSelect.jsx";
import Toggle from "./toggle.jsx";
import CurrentPosition from "./CurrentPosition.jsx";
import Results from "./Results.jsx";
import Access from "./access.jsx";

function AppRoutes() {
  const location = useLocation();

  const hasAccess =
    sessionStorage.getItem("consider_access_granted") === "true";

  if (!hasAccess && location.pathname !== "/access") {
    return <Navigate to="/access" replace />;
  }

  return (
    <Routes>
      <Route path="/access" element={<Access />} />

      <Route path="/" element={<Home />} />
      <Route path="/debate-intro" element={<DebateIntro />} />
      <Route path="/select-rvd" element={<RVDSelect />} />
      <Route path="/toggle" element={<Toggle />} />
      <Route path="/current-position" element={<CurrentPosition />} />
      <Route path="/play" element={<Chat />} />
      <Route path="/results" element={<Results />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}
