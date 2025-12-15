import json

INPUT_FILE = "songs_output.json"   # change to your filename

def find_christmas_songs():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        songs = json.load(f)

    christmas_songs = [
        s for s in songs 
        if "christmas" in s["title"].lower()
    ]

    print(f"Found {len(christmas_songs)} Christmas songs:\n")

    for song in christmas_songs:
        print(f"- {song['title']} — {song['artist']} ({song['year_first_seen']})")

    return christmas_songs


if __name__ == "__main__":
    find_christmas_songs()
