from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from users import router as users_router
import random

app = FastAPI()

# Must come first!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (for dev)
    allow_credentials=True,
    allow_methods=["*"],  # allow GET, POST, OPTIONS...
    allow_headers=["*"],
)

app.include_router(users_router)

QUESTIONS = [
    {"question": "What is the largest planet?", "options": ["Earth","Jupiter","Saturn","Mars"], "answer":"Jupiter"},
    {"question": "Who painted the Mona Lisa?", "options":["Van Gogh","Picasso","Da Vinci","Rembrandt"], "answer":"Da Vinci"}
]

@app.get("/questions")
def get_questions():
    return random.sample(QUESTIONS, len(QUESTIONS))
