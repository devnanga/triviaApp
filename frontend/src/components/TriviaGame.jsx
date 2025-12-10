import { useEffect, useState } from "react";

export default function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/trivia-app/data/questions.json");
        const data = await res.json();
        setQuestions([...data].sort(() => Math.random() - 0.5));
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

  if (index >= questions.length) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>Quiz Complete!</h2>
        <p>Your score: {score} / {questions.length}</p>
      </div>
    );
  }

  const q = questions[index];

  function handleSelect(option) {
    setSelected(option);
    if (option === q.answer) setScore((s) => s + 1);
  }

  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>{q.question}</h2>

      {q.options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          disabled={selected !== null}
          style={{
            margin: "8px auto",
            display: "block",
            padding: "10px 14px",
            width: "240px",
            borderRadius: "8px",
            border: "1px solid #aaa",
            background:
              !selected ? ""
              : option === q.answer ? "lightgreen"
              : selected === option ? "#f88"
              : "",
          }}
        >
          {option}
        </button>
      ))}

      {selected && (
        <button
          onClick={next}
          style={{
            marginTop: "15px",
            padding: "8px 12px",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}
