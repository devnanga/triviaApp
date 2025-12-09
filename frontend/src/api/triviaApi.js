export async function getQuestions() {
    const res = await fetch("http://localhost:8000/questions");
    return res.json();
  }
  