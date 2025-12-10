export default function HomePage({ onSelect }) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h1>StreetMeat Home</h1>
        <p>Select an option:</p>
  
        <button
          onClick={() => onSelect("trivia")}
          style={{
            display: "block",
            margin: "12px auto",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #777",
            cursor: "pointer",
          }}
        >
          🎮 Play Trivia
        </button>
  
        <button
          onClick={() => onSelect("facts")}
          style={{
            display: "block",
            margin: "12px auto",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #777",
            cursor: "pointer",
          }}
        >
          💡 Fun Facts
        </button>
      </div>
    );
  }
  