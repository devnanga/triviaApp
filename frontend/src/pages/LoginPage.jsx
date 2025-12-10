import { useState } from "react";
import logo from "../assets/streetmeat.jpg";

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      // Load users.txt from the public folder
      const res = await fetch("/data/users.txt");
      const text = await res.text();

      // Convert text file into array of names
      const allowedUsers = text
        .split("\n")
        .map((line) => line.trim().toLowerCase())
        .filter((line) => line.length > 0);

      // Validate login
      if (allowedUsers.includes(name.trim().toLowerCase())) {
        onLogin(name.trim());
      } else {
        setError("Sorry, not allowed.");
      }
    } catch (err) {
      setError("Error loading users.");
      console.error(err);
    }
  }

  return (
    <div style={styles.container}>
      <img src={logo} alt="Logo" style={styles.logo} />
      <h1>Welcome Street Meat</h1>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Enter</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "5rem",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  logo: {
    width: "200px",
    marginBottom: "1rem",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "250px",
  },
  button: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};






































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
