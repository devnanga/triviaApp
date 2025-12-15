import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  const [startYear, setStartYear] = useState(1958);
  const [endYear, setEndYear] = useState(2025);
  const years = Array.from({ length: 2025 - 1958 + 1 }, (_, i) => 1958 + i);

  // Optional: small floating animation effect for the background particles
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setOffset(prev => (prev + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const goToGame = (game) => {
    navigate(`/trivia/${game}?start=${startYear}&end=${endYear}`);
  };

  return (
    <div className="home-container">
      <div className="particles" style={{ backgroundPositionY: `${offset}px` }}></div>
      <h1 className="title">🎵 Trivia Games</h1>

      <div className="year-selector">
        <p>Select a year range, or leave defaults for full song list.</p>

        <div className="dropdowns">
          <label>
            Start Year:
            <select value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>

          <label>
            End Year:
            <select value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="games">
        <h3>Choose a Trivia Game</h3>

        <div className="game">
          <button onClick={() => goToGame("easy")}>Trivia Game 1 - Easy</button>
          <span>Display 120 characters from the song</span>
        </div>

        <div className="game">
          <button onClick={() => goToGame("hard")}>Trivia Game 2 - Hard</button>
          <span>Display 60 characters from the song</span>
        </div>

        <div className="game">
          <button onClick={() => goToGame("mcq")}>Trivia Game 3 - MCQ</button>
          <span>Multiple-choice questions with artist & song options</span>
        </div>
      </div>

      <div className="fun-pages">
        <h3>Fun Pages</h3>
        <button onClick={() => navigate("/facts")}>Fun Facts</button>
      </div>
    </div>
  );
}
