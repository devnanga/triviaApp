import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Welcome!</h1>
      <div style={{ marginTop: "2rem" }}>
        <Link to="/facts">
          <button style={{ padding: "10px 14px", margin: "10px" }}>Fun Facts</button>
        </Link>
        <Link to="/trivia">
          <button style={{ padding: "10px 14px", margin: "10px" }}>Trivia Game</button>
        </Link>
      </div>
    </div>
  );
}
