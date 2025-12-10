import { Link } from "react-router-dom";

export default function HomeButton() {
  return (
    <div style={{ position: "absolute", top: 20, right: 20 }}>
      <Link to="/home">
        <button style={{ padding: "6px 12px", cursor: "pointer" }}>
          Home
        </button>
      </Link>
    </div>
  );
}
