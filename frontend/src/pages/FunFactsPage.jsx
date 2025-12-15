import { useEffect, useState } from "react";
import HomeButton from "../components/HomeButton";
import "./FunFactsPage.css";

export default function FunFactsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startYear, setStartYear] = useState(1958);
  const [endYear, setEndYear] = useState(2025);

  const [view, setView] = useState("general");
  const [artistQuery, setArtistQuery] = useState("");

  const years = Array.from({ length: 2025 - 1958 + 1 }, (_, i) => 1958 + i);

  useEffect(() => {
    async function load() {
      try {
        const BASE = import.meta.env.BASE_URL || "/";
        const res = await fetch(`${BASE}data/songs.json`);
        const songs = await res.json();

        const filteredSongs = songs.filter(
          (s) => s.year_first_seen >= startYear && s.year_first_seen <= endYear
        );

        // -------- #1 Hits --------
        const number1HitsByArtist = {};
        filteredSongs.forEach((s) => {
          if (s.highest_rank === 1) {
            number1HitsByArtist[s.artist] =
              number1HitsByArtist[s.artist] || [];
            number1HitsByArtist[s.artist].push({
              title: s.title,
              year: s.year_first_seen,
            });
          }
        });

        const top1Artists = Object.entries(number1HitsByArtist)
          .map(([artist, hits]) => ({
            artist,
            hitsCount: hits.length,
            hits,
          }))
          .sort((a, b) => b.hitsCount - a.hitsCount)
          .slice(0, 10);

        // -------- Appearances --------
        const appearances = {};
        filteredSongs.forEach((s) => {
          appearances[s.artist] = (appearances[s.artist] || 0) + 1;
        });

        const topAppearances = Object.entries(appearances)
          .map(([artist, count]) => ({ artist, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        // -------- Months --------
        const months = [
          "january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december",
        ];

        const songsWithMonths = filteredSongs.filter((s) =>
          months.some((m) => s.title.toLowerCase().includes(m))
        );

        // -------- Christmas --------
        const christmasKeywords = ["christmas", "xmas", "noel", "holiday"];
        const christmasSongs = filteredSongs.filter((s) =>
          christmasKeywords.some((k) =>
            s.title.toLowerCase().includes(k)
          )
        );

        setStats({
          totalSongs: filteredSongs.length,
          top1Artists,
          topAppearances,
          songsWithMonths,
          christmasSongs,
          allSongs: filteredSongs,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [startYear, endYear]);

  const monthOrder = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december"
  ];

  const songsWithMonthsSorted = stats?.songsWithMonths
    ? [...stats.songsWithMonths].sort((a, b) => {
        const getMonthIndex = (title) =>
          monthOrder.findIndex((m) => title.toLowerCase().includes(m));
        return getMonthIndex(a.title) - getMonthIndex(b.title);
      })
    : [];

  if (loading) return <p className="loading-text">Loading fun facts...</p>;
  if (!stats) return <p className="loading-text">No data found.</p>;

  const artistResults = artistQuery
    ? stats.allSongs.filter((s) =>
        s.artist.toLowerCase().includes(artistQuery.toLowerCase())
      )
    : [];

  return (
    <div className="funfacts-container">
      <div className="funfacts-home">
        <HomeButton />
      </div>

      <h1>Fun Facts</h1>

      {/* Year Filters */}
      <div className="year-selector">
        <label>
          Start Year:
          <select value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label>
          End Year:
          <select value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
      </div>

      {/* Tabs */}
      <div className="funfacts-tabs">
        {["general", "months", "christmas", "artist"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={view === v ? "active" : ""}
          >
            {v === "general" && "General Facts"}
            {v === "months" && "Songs With Months"}
            {v === "christmas" && "Christmas Songs"}
            {v === "artist" && "Artist Lookup"}
          </button>
        ))}
      </div>

      {/* -------- GENERAL -------- */}
      {view === "general" && (
        <>
          <p><strong>Total songs:</strong> {stats.totalSongs}</p>

          <h2>Top 10 Artists by #1 Hits</h2>
          <table className="funfacts-table">
            <thead>
              <tr>
                <th>Artist</th>
                <th>#1 Hits</th>
                <th>Songs</th>
              </tr>
            </thead>
            <tbody>
              {stats.top1Artists.map((a) => (
                <tr key={a.artist}>
                  <td>{a.artist}</td>
                  <td>{a.hitsCount}</td>
                  <td>{a.hits.map(h => `${h.title} (${h.year})`).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Top 10 Artists by Total Appearances</h2>
          <table className="funfacts-table">
            <thead>
              <tr>
                <th>Artist</th>
                <th>Number of Songs</th>
              </tr>
            </thead>
            <tbody>
              {stats.topAppearances.map((a) => (
                <tr key={a.artist}>
                  <td>{a.artist}</td>
                  <td>{a.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* -------- MONTHS -------- */}
      {view === "months" && (
        <>
          <h2>Songs With Months in the Title</h2>
          <table className="funfacts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {songsWithMonthsSorted.map((s) => (
                <tr key={`${s.title}-${s.artist}`}>
                  <td>{s.title}</td>
                  <td>{s.artist}</td>
                  <td>{s.year_first_seen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* -------- CHRISTMAS -------- */}
      {view === "christmas" && (
        <>
          <h2>Christmas Songs 🎄</h2>
          <table className="funfacts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {stats.christmasSongs.map((s) => (
                <tr key={`${s.title}-${s.artist}`}>
                  <td>{s.title}</td>
                  <td>{s.artist}</td>
                  <td>{s.year_first_seen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* -------- ARTIST LOOKUP -------- */}
      {view === "artist" && (
        <>
          <h2>Artist Lookup</h2>
          <input
            className="artist-input"
            placeholder="Search artist..."
            value={artistQuery}
            onChange={(e) => setArtistQuery(e.target.value)}
          />

          {artistQuery && (
            <table className="funfacts-table">
              <thead>
                <tr>
                  <th>Song</th>
                  <th>Year</th>
                  <th>Highest Rank</th>
                </tr>
              </thead>
              <tbody>
                {artistResults.map((s) => (
                  <tr key={`${s.title}-${s.year_first_seen}`}>
                    <td>{s.title}</td>
                    <td>{s.year_first_seen}</td>
                    <td>{s.highest_rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
