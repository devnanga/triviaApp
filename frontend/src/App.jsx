import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TriviaGame from "./components/TriviaGame";
import FunFactsPage from "./pages/FunFactsPage"; 
import HomeButton from "./components/HomeButton";

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login"); 

  function onLogin(name) {
    setUser(name);
    setScreen("home");
  }

  function goHome() {
    setScreen("home");
  }

  return (
    <div>
      {user && screen !== "login" && <HomeButton goHome={goHome} />}

      {screen === "login" && <LoginPage onLogin={onLogin} />}

      {screen === "home" && (
        <HomePage
          onSelect={(choice) => setScreen(choice)}
        />
      )}

      {screen === "trivia" && <TriviaGame />}

      {screen === "facts" && <FunFactsPage />}
    </div>
  );
}




































// import { useState } from "react";
// import Login from "./pages/LoginPage";
// import TriviaGame from "./components/TriviaGame";
// export default function App() {
//   const [user, setUser] = useState(null);

//   if (!user) {
//     return <Login onLogin={setUser} />;
//   }

//   return (
//     <>
//       <header style={{ padding: "10px" }}>
//         Welcome: <strong>{user}</strong>
//       </header>
//       <TriviaGame />
//     </>
//   );
// }
