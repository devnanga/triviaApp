export default function HomeButton({ goHome }) {
    return (
      <button
        onClick={goHome}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "8px 12px",
          borderRadius: "8px",
          cursor: "pointer",
          border: "1px solid #ccc",
          fontWeight: "bold",
        }}
      >
        Home
      </button>
    );
  }
  