import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TriviaGame from "./components/TriviaGame";
import FunFactsPage from "./pages/FunFactsPage";
import HomeButton from "./components/HomeButton";
import TriviaEasy from "./components/TriviaEasy";
import TriviaHard from "./components/TriviaHard";
import TriviaMCQ from "./components/TriviaMCQ";

import "./index.css";

export default function App() {
  const [user, setUser] = useState(null);

  function onLogin(name) {
    setUser(name);
  }

  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        {/* HomeButton should stay top-left, so wrap it separately */}
        {user && <HomeButton />}

        <div className="w-full flex flex-col items-center justify-center">
          <Routes>
            <Route path="/" element={<LoginPage onLogin={onLogin} />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/trivia" element={<TriviaGame />} />
            <Route path="/facts" element={<FunFactsPage />} />
            <Route path="/trivia/easy" element={<TriviaEasy />} />
            <Route path="/trivia/hard" element={<TriviaHard />} />
            <Route path="/trivia/mcq" element={<TriviaMCQ />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
