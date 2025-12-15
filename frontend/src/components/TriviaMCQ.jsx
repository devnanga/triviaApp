import { useEffect, useState } from "react";
import HomeButton from "./HomeButton";

export default function TriviaMCQ() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startYear, setStartYear] = useState(1958);
  const [endYear, setEndYear] = useState(2025);

  // Load songs from public folder
  useEffect(() => {
    async function loadSongs() {
      try {
        const BASE = import.meta.env.BASE_URL || "/";
        const res = await fetch(`${BASE}data/songs_with_lyrics_final.json`);
        const data = await res.json();
        setSongs(data.filter((s) => s.lyrics_snippet)); // filter out null lyrics
      } catch (err) {
        console.error("Failed to load songs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSongs();
  }, []);

  // Filter songs by year
  useEffect(() => {
    setFilteredSongs(
      songs.filter(
        (s) =>
          s.year_first_seen &&
          s.year_first_seen >= startYear &&
          s.year_first_seen <= endYear
      )
    );
  }, [songs, startYear, endYear]);

  // Pick a random question
  function nextQuestion() {
    setSelected(null);
    if (!filteredSongs.length) return;

    const question = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
    setCurrentQuestion(question);

    // Generate 3 wrong choices
    const otherChoices = filteredSongs
      .filter((s) => s.title !== question.title)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allChoices = [...otherChoices, question].sort(() => Math.random() - 0.5);
    setChoices(allChoices);
  }

  function selectAnswer(choice) {
    setSelected(choice);
    if (choice.title === currentQuestion.title && choice.artist === currentQuestion.artist) {
      setScore((s) => s + 1);
    }
  }

  useEffect(() => {
    if (filteredSongs.length) nextQuestion();
  }, [filteredSongs]);

  if (loading) return <p>Loading MCQ...</p>;
  if (!filteredSongs.length) return <p>No songs available for this year range.</p>;
  if (!currentQuestion) return null;

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <HomeButton />

      <h2>MCQ: Guess the Song & Artist!</h2>

      {/* Year selectors */}
      <div style={{ marginBottom: "1rem" }}>
        Start Year:{" "}
        <select value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value))}>
          {Array.from({ length: 2025 - 1958 + 1 }, (_, i) => 1958 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {" "} End Year:{" "}
        <select value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value))}>
          {Array.from({ length: 2025 - 1958 + 1 }, (_, i) => 1958 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <pre style={{ whiteSpace: "pre-wrap", marginBottom: "1rem" }}>
        {currentQuestion.lyrics_snippet}
      </pre>

      {choices.map((c) => (
        <button
          key={`${c.artist}-${c.title}`}
          onClick={() => selectAnswer(c)}
          disabled={!!selected}
          style={{
            display: "block",
            margin: "8px auto",
            padding: "10px 14px",
            width: "250px",
            borderRadius: "6px",
            background:
              selected && c.title === currentQuestion.title && c.artist === currentQuestion.artist
                ? "lightgreen"
                : selected && c === selected
                ? "#f88"
                : "",
          }}
        >
          {c.artist} – {c.title}
        </button>
      ))}

      {selected && (
        <div style={{ marginTop: 20 }}>
          <strong>Score:</strong> {score} <br />
          <button
            onClick={nextQuestion}
            style={{ marginTop: 10, padding: "8px 12px", borderRadius: "6px" }}
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}
