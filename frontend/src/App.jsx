import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TriviaGame from "./components/TriviaGame";
import FunFactsPage from "./pages/FunFactsPage";
import HomeButton from "./components/HomeButton";

export default function App() {
  const [user, setUser] = useState(null);

  function onLogin(name) {
    setUser(name);
  }

  return (
    <Router>
      <div>
        {user && <HomeButton />}

        <Routes>
          <Route path="/" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/trivia" element={<TriviaGame />} />
          <Route path="/facts" element={<FunFactsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
