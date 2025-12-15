import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeButton from "./HomeButton";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function TriviaEasy() {
    const query = useQuery();
    const startYear = parseInt(query.get("start")) || 1958;
    const endYear = parseInt(query.get("end")) || 2025;

    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [snippet, setSnippet] = useState("");
    const [artistGuess, setArtistGuess] = useState("");
    const [songGuess, setSongGuess] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);

    const [artistSuggestions, setArtistSuggestions] = useState([]);
    const [songSuggestions, setSongSuggestions] = useState([]);

    useEffect(() => {
        async function loadSongs() {
            try {
                const BASE = import.meta.env.BASE_URL || "/";
                const res = await fetch(`${BASE}data/songs_with_lyrics_final.json`);
                const data = await res.json();

                const filtered = data.filter(
                    (s) =>
                        s.year_first_seen >= startYear &&
                        s.year_first_seen <= endYear &&
                        s.lyrics_snippet
                );

                setSongs(filtered);
            } catch (err) {
                console.error(err);
            }
        }
        loadSongs();
    }, [startYear, endYear]);

    function nextSong() {
        setShowAnswer(false);
        setArtistGuess("");
        setSongGuess("");

        if (!songs.length) return;

        const song = songs[Math.floor(Math.random() * songs.length)];
        setCurrentSong(song);

        const text = song.lyrics_snippet.slice(0, 120);
        setSnippet(text);
    }

    function checkGuess() {
        let points = 0;
        if (currentSong.artist.toLowerCase() === artistGuess.trim().toLowerCase()) points += 0.5;
        if (currentSong.title.toLowerCase() === songGuess.trim().toLowerCase()) points += 0.5;

        setScore((s) => s + points);
        setShowAnswer(true);
    }

    // autocomplete
    useEffect(() => {
        if (!artistGuess) return setArtistSuggestions([]);
        const matches = songs
            .map((s) => s.artist)
            .filter((a) => a.toLowerCase().includes(artistGuess.toLowerCase()));
        setArtistSuggestions([...new Set(matches)]);
    }, [artistGuess, songs]);

    useEffect(() => {
        if (!songGuess) return setSongSuggestions([]);
        const matches = songs
            .map((s) => s.title)
            .filter((t) => t.toLowerCase().includes(songGuess.toLowerCase()));
        setSongSuggestions([...new Set(matches)]);
    }, [songGuess, songs]);

    useEffect(() => {
        if (songs.length) nextSong();
    }, [songs]);

    return (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <HomeButton />
            <h2>Trivia Game 1 - Easy (120 chars)</h2>
            <p>Score: {score}</p>

            <pre style={{ whiteSpace: "pre-wrap", marginBottom: "1rem" }}>{snippet}</pre>

            <div style={{ position: "relative", marginBottom: 10 }}>
                <input
                    placeholder="Guess artist..."
                    value={artistGuess}
                    onChange={(e) => setArtistGuess(e.target.value)}
                    onBlur={() => setArtistSuggestions([])}
                    style={{ marginRight: 10, padding: "6px", width: "200px" }}
                />

                {artistSuggestions.length > 0 && (
                    <div style={{ position: "absolute", background: "#fff", border: "1px solid #ccc", width: "200px", maxHeight: "120px", overflowY: "auto", zIndex: 10 }}>
                        {artistSuggestions.map((a) => (
                            <div
  key={a}
  style={{ padding: "4px", cursor: "pointer" }}
  onMouseDown={() => {
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
                    placeholder="Guess song..."
                    value={songGuess}
                    onChange={(e) => setSongGuess(e.target.value)}
                    onBlur={() => setSongSuggestions([])}
                    style={{ padding: "6px", width: "200px" }}
                />

                {songSuggestions.length > 0 && (
                    <div style={{ position: "absolute", background: "#fff", border: "1px solid #ccc", width: "200px", maxHeight: "120px", overflowY: "auto", zIndex: 10 }}>
                        {songSuggestions.map((s) => (
                            <div key={s} style={{ padding: "4px", cursor: "pointer" }} onMouseDown={() => {
                                setSongGuess(s);
                                setSongSuggestions([]);
                              }}>{s}</div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button onClick={checkGuess} style={{ marginRight: 10, padding: "6px 12px" }}>Check Guess</button>
                <button onClick={nextSong} style={{ padding: "6px 12px" }}>Next Song</button>
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
