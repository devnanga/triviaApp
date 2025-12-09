from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

USERS_FILE = "users.txt"

def load_users():
    with open(USERS_FILE, "r") as f:
        return [line.strip().lower() for line in f.readlines()]

class LoginRequest(BaseModel):
    name: str

@router.post("/login")
def login(data: LoginRequest):
    name = data.name.lower()
    if name in load_users():
        return {"allowed": True}
    return {"allowed": False}
