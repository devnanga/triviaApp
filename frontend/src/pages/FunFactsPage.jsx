export default function FunFactsPage() {
    const facts = [
      "Bananas are berries, but strawberries are not.",
      "Octopuses have three hearts.",
      "Honey never spoils.",
    ];
  
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>Fun Facts</h2>
  
        <ul style={{ marginTop: "1rem" }}>
          {facts.map((fact, i) => (
            <li key={i} style={{ margin: "8px 0" }}>
              {fact}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  