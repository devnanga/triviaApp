import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/streetmeat.jpg";

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load users from JSON on mount
  useEffect(() => {
    async function loadUsers() {
      try {
        const BASE = import.meta.env.BASE_URL || "/";
        const res = await fetch(`${BASE}data/users.json`);
        const data = await res.json();
        setUsers(data.map((u) => u.toLowerCase()));
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    }
    loadUsers();
  }, []);
  

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    if (users.includes(name.trim().toLowerCase())) {
      onLogin(name);
      navigate("/home");
    } else {
      setError("Respectfully, hymc :)");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <img
        src={logo}
        alt="Logo"
        style={{ width: "200px", borderRadius: "12px", marginBottom: "1rem" }}
      />

      <h1>Welcome to StreetMeat</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #aaa",
            width: "220px",
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            border: "1px solid #aaa",
          }}
        >
          Enter
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}


































// BACKEND CODE

// import { useState } from "react";
// import logo from "../assets/streetmeat.jpg"; // <-- correct path

// export default function LoginPage({ onLogin }) {
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");

//   async function handleLogin(e) {
//     e.preventDefault();

//     if (!name.trim()) return;

//     const res = await fetch("http://127.0.0.1:8000/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name }),
//     });

//     const data = await res.json();

//     if (data.allowed) {
//       onLogin(name);
//     } else {
//       setError("Sorry, not allowed.");
//     }
//   }

//   return (
//     <div style={styles.container}>
//       <img src={logo} alt="Logo" style={styles.logo} />

//       <h1>Welcome Street Meat</h1>

//       <form onSubmit={handleLogin} style={styles.form}>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           style={styles.input}
//         />
//         <button type="submit" style={styles.button}>Enter</button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: "5rem",
//     fontFamily: "sans-serif",
//     textAlign: "center",
//   },
//   logo: {
//     width: "200px",
//     marginBottom: "1rem",
//     borderRadius: "10px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.5rem",
//   },
//   input: {
//     padding: "0.5rem",
//     fontSize: "1rem",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     width: "250px",
//   },
//   button: {
//     padding: "0.5rem",
//     fontSize: "1rem",
//     borderRadius: "5px",
//     border: "none",
//     cursor: "pointer",
//   },
// };
