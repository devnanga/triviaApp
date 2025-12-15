import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton";

export default function TriviaGame() {
  const navigate = useNavigate();

  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [lyricsSnippet, setLyricsSnippet] = useState("");
  const [artistGuess, setArtistGuess] = useState("");
  const [songGuess, setSongGuess] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [songSuggestions, setSongSuggestions] = useState([]);

  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Load songs with lyrics from public folder and filter null lyrics
  useEffect(() => {
    async function loadSongs() {
      try {
        const BASE = import.meta.env.BASE_URL || "/";
        const res = await fetch(`${BASE}data/songs_with_lyrics_final.json`);
        const data = await res.json();
        const filtered = data.filter((s) => s.lyrics_snippet); // skip null lyrics
        setSongs(filtered);
      } catch (err) {
        console.error("Failed to load songs:", err);
      }
    }
    loadSongs();
  }, []);

  // Pick a random song
  function nextSong() {
    setShowAnswer(false);
    setArtistGuess("");
    setSongGuess("");

    if (!songs.length) return;

    const song = songs[Math.floor(Math.random() * songs.length)];
    setCurrentSong(song);

    let snippet = song.lyrics_snippet || "";
    let lines = snippet.split("\n").filter((l) => l.trim() !== "");
    let displaySnippet = lines.slice(0, 3).join("\n");

    if (displaySnippet.length < 60 && snippet.length > 60) {
      displaySnippet = snippet.slice(0, 60);
    }

    setLyricsSnippet(displaySnippet);
  }

  function checkGuess() {
    if (!currentSong) return;
  
    let points = 0;
    if (artistGuess.trim().toLowerCase() === currentSong.artist.toLowerCase()) points += 0.5;
    if (songGuess.trim().toLowerCase() === currentSong.title.toLowerCase()) points += 0.5;
  
    setScore((prev) => ({
      correct: prev.correct + points,
      total: prev.total + 1, // total attempts still increments by 1 per song
    }));
  
    setShowAnswer(true);
  }
  
  useEffect(() => {
    if (songs.length) nextSong();
  }, [songs]);

  // Autocomplete for artist
  useEffect(() => {
    if (!artistGuess) return setArtistSuggestions([]);
    const matches = songs
      .map((s) => s.artist)
      .filter((a) => a.toLowerCase().includes(artistGuess.toLowerCase()));
    setArtistSuggestions([...new Set(matches)]);
  }, [artistGuess, songs]);

  // Autocomplete for song title
  useEffect(() => {
    if (!songGuess) return setSongSuggestions([]);
    const matches = songs
      .map((s) => s.title)
      .filter((t) => t.toLowerCase().includes(songGuess.toLowerCase()));
    setSongSuggestions([...new Set(matches)]);
  }, [songGuess, songs]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <HomeButton />

      <h2>Guess the Song & Artist!</h2>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Score:</strong> {score.correct} / {score.total}
      </div>

      <pre style={{ whiteSpace: "pre-wrap", marginBottom: "1rem" }}>
        {lyricsSnippet}
      </pre>

      <div style={{ position: "relative", marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Guess artist..."
          value={artistGuess}
          onChange={(e) => setArtistGuess(e.target.value)}
          style={{ marginRight: 10, padding: "6px", width: "200px" }}
        />
        {artistSuggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              background: "#fff",
              border: "1px solid #ccc",
              width: "200px",
              maxHeight: "120px",
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {artistSuggestions.map((a) => (
              <div
                key={a}
                style={{ padding: "4px", cursor: "pointer" }}
                onClick={() => {
                  setArtistGuess(a);
                  setArtistSuggestions([]);
                }}
              >
                {a}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "relative", marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Guess song..."
          value={songGuess}
          onChange={(e) => setSongGuess(e.target.value)}
          style={{ padding: "6px", width: "200px" }}
        />
        {songSuggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              background: "#fff",
              border: "1px solid #ccc",
              width: "200px",
              maxHeight: "120px",
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {songSuggestions.map((s) => (
              <div
                key={s}
                style={{ padding: "4px", cursor: "pointer" }}
                onClick={() => {
                  setSongGuess(s);
                  setSongSuggestions([]);
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={checkGuess}
          style={{ marginRight: 10, padding: "6px 12px" }}
        >
          Check Guess
        </button>
        <button onClick={nextSong} style={{ padding: "6px 12px" }}>
          Next Song
        </button>
      </div>

      {showAnswer && currentSong && (
        <div style={{ marginTop: 20 }}>
          <strong>Correct Artist:</strong> {currentSong.artist} <br />
          <strong>Correct Song:</strong> {currentSong.title}
        </div>
      )}
    </div>
  );
}
