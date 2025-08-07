// src/App.jsx
import {React, useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuBar from './MenuBar.jsx';
import Home from './Home.jsx';
import Chat from './Chat.jsx';
import DebateIntro from './DebateIntro.jsx'; 
import RVDSelect from './RVDSelect.jsx';
import CurrentPosition from './CurrentPosition.jsx'; 
import Results from './Results.jsx';


function App() {
  return (
    <BrowserRouter>
      <MenuBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/debate-intro" element={<DebateIntro />} /> 
        <Route path="/select-rvd" element={<RVDSelect />} />
        <Route path="/current-position" element={<CurrentPosition />} />
        <Route path="/play" element={<Chat />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
