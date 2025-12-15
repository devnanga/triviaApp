# fetch_lyrics_gpt_new.py
import json
import time
import openai
from pathlib import Path

# Set your API key (or via environment variable)

SONGS_FILE = Path("songs.json")
OUTPUT_FILE = Path("songs_with_lyrics.json")

MAX_RETRIES = 3
RETRY_DELAY = 2

# Load songs
with open(SONGS_FILE, "r", encoding="utf-8") as f:
    songs = json.load(f)

songs_with_lyrics = []

for i, song in enumerate(songs):
    title = song.get("title")
    artist = song.get("artist")

    prompt = (
        f"Provide 2–3 short lines from the lyrics of the song '{title}' "
        f"by '{artist}'. Only provide the lyrics, no explanations."
    )

    success = False
    for attempt in range(MAX_RETRIES):
        try:
            print(f"[{i+1}/{len(songs)}] Fetching lyrics for: {title} by {artist}")
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100
            )
            lyrics = response.choices[0].message.content.strip()
            song_copy = song.copy()
            song_copy["lyrics_snippet"] = lyrics
            songs_with_lyrics.append(song_copy)
            success = True
            time.sleep(0.5)
            break
        except Exception as e:
            print(f"Error fetching '{title}' by '{artist}': {e}")
            time.sleep(RETRY_DELAY)

    if not success:
        print(f"Skipping '{title}' by '{artist}' after {MAX_RETRIES} failed attempts.")
        song_copy = song.copy()
        song_copy["lyrics_snippet"] = ""
        songs_with_lyrics.append(song_copy)

# Save output
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(songs_with_lyrics, f, indent=2, ensure_ascii=False)

print(f"\nFinished! Saved lyrics snippets to {OUTPUT_FILE}")





