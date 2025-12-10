export default function HomePage({ onSelect }) {
    return (
      <div style={styles.container}>
        <h1>Welcome!</h1>
  
        <div style={styles.buttons}>
          <button style={styles.button} onClick={() => onSelect("facts")}>
            Fun Facts
          </button>
  
          <button style={styles.button} onClick={() => onSelect("trivia")}>
            Trivia Game
          </button>
        </div>
      </div>
    );
  }
  
  const styles = {
    container: {
      textAlign: "center",
      marginTop: "4rem",
    },
    buttons: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginTop: "2rem",
    },
    button: {
      padding: "10px 18px",
      fontSize: "1.1rem",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };
  