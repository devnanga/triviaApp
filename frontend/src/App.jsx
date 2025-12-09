import { useState } from "react";
import Login from "./pages/LoginPage";
import Trivia from "./components/TriviaGame"

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <>
      <header style={{ padding: "10px" }}>
        Welcome: <strong>{user}</strong>
      </header>
      <Trivia />
    </>
  );
}
