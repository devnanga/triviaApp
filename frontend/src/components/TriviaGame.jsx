import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/data/questions.json");
        const data = await res.json();

        // shuffle the questions
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading questions...</p>;
  if (!questions.length) return <p>No questions found.</p>;

  // If quiz is done
  if (index >= questions.length) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          Your score: <strong>{score}</strong> / {questions.length}
        </p>

        <button
  onClick={() => (window.location.href = "/home")}
  style={{
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid #888",
    background: "#eee",
    fontWeight: "bold",
  }}
>
  Return Home
</button>

      </div>
    );
  }

  const q = questions[index];
  const options = Array.isArray(q.options) ? q.options : [];

  function handleSelect(option) {
    setSelected(option);
    if (option === q.answer) {
      setScore((prev) => prev + 1);
    }
  }

  function next() {
    setSelected(null);
    setIndex((prev) => prev + 1);
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>{q.question}</h2>

      <div>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={selected !== null}
            style={{
              margin: "8px 0",
              display: "block",
              padding: "8px 12px",
              border: "1px solid #aaa",
              borderRadius: "6px",
              width: "200px",
              textAlign: "left",
              cursor: "pointer",
              background:
                selected === null
                  ? ""
                  : option === q.answer
                  ? "lightgreen"
                  : selected === option
                  ? "#f99"
                  : "",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <button
          onClick={next}
          style={{
            marginTop: 15,
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            border: "1px solid #888",
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}
