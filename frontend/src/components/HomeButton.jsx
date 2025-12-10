export default function HomeButton({ goHome }) {
    return (
      <button
        onClick={goHome}
        style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
          background: "#eee",
          border: "1px solid #aaa",
        }}
      >
        Home
      </button>
    );
  }
  