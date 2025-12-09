import { useEffect, useState } from "react";
import { getQuestions } from "../api/triviaApi";

export default function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getQuestions();
      setQuestions(data);
    }
    load();
  }, []);

  if (questions.length === 0) return <p>Loading questions...</p>;

  const q = questions[index];

  function handleSelect(option) {
    setSelected(option);
    if (option === q.answer) {
      setScore(score + 1);
    }
  }

  function next() {
    setSelected(null);
    setIndex(index + 1);
  }

  if (index >= questions.length) {
    return (
      <div>
        <h2>Quiz Complete!</h2>
        <p>Your score: {score} / {questions.length}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>{q.question}</h2>

      <div>
        {q.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            style={{
              margin: "8px 0",
              display: "block",
              padding: "8px 12px",
              border: "1px solid #aaa",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <button onClick={next} style={{ marginTop: 10 }}>
          Next
        </button>
      )}
    </div>
  );
}
