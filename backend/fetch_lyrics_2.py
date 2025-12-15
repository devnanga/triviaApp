import json
import os
import time
import re
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

SONGS_FILE = "songs.json"
OUTPUT_FILE = "songs_with_lyrics_final.json"

THREADS = 15
MAX_RETRIES = 2
GOOGLE_DELAY = 0.8  # seconds between Google attempts

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
}

# ----------------------------------------
# Load songs
# ----------------------------------------
with open(SONGS_FILE, "r", encoding="utf-8") as f:
    songs = json.load(f)

# Load existing output
if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
        output = json.load(f)
else:
    output = songs.copy()  # start with full list if output missing

# Build processed set (only songs that already have lyrics)
processed = set(
    (s["title"].strip(), s["artist"].strip())
    for s in output
    if s.get("lyrics_snippet")
)

print(f"▶ Total songs: {len(songs)}")
print(f"▶ Already processed (with lyrics): {len(processed)}\n")


# ----------------------------------------
# Helpers
# ----------------------------------------
def generate_title_variants(title):
    variants = {title}
    variants.add(re.sub(r"\(.*?\)", "", title).strip())  # no parens
    variants.add(re.sub(r"[^A-Za-z0-9 ]+", "", title))   # no punctuation
    variants.add(re.sub(r"feat.*", "", title, flags=re.I).strip())  # remove feat
    return [v for v in variants if v]


def try_lyrics_api(artist, title):
    try:
        url = f"https://api.lyrics.ovh/v1/{artist.replace(' ', '%20')}/{title.replace(' ', '%20')}"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            lyrics = r.json().get("lyrics", "")
            if lyrics:
                lines = lyrics.splitlines()
                snippet = "\n".join(lines[:5])
                return snippet if len(snippet) >= 120 else lyrics[:120]
    except:
        pass
    return None


def try_google_scrape(artist, title):
    query = f"{title} {artist} lyrics"
    url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
    time.sleep(GOOGLE_DELAY)
    try:
        html = requests.get(url, headers=headers, timeout=4).text
        match = re.search(r'<span class="hgKElc">(.+?)</span>', html)
        if match:
            snippet = match.group(1).replace("<br>", "\n").strip()
            return snippet[:200]
    except:
        pass
    return None


# ----------------------------------------
# Fetch lyrics for ONE song
# ----------------------------------------
def process_song(song):
    title = song["title"].strip()
    artist = song["artist"].strip()

    if (title, artist) in processed:
        return None

    variants = generate_title_variants(title)

    for variant in variants:
        for _ in range(MAX_RETRIES):
            snippet = try_lyrics_api(artist, variant)
            if snippet:
                return {**song, "lyrics_snippet": snippet}

            snippet = try_google_scrape(artist, variant)
            if snippet:
                return {**song, "lyrics_snippet": snippet}

    return {**song, "lyrics_snippet": None}


# ----------------------------------------
# Filter songs needing a second pass
# ----------------------------------------
songs_to_retry = [s for s in output if not s.get("lyrics_snippet")]
print(f"▶ Songs needing a second pass: {len(songs_to_retry)}\n")

# ----------------------------------------
# Process in parallel
# ----------------------------------------
with ThreadPoolExecutor(max_workers=THREADS) as executor:
    futures = {executor.submit(process_song, s): s for s in songs_to_retry}

    for idx, future in enumerate(as_completed(futures), 1):
        result = future.result()
        if result is None:
            continue

        title = result["title"]
        artist = result["artist"]
        snippet = result["lyrics_snippet"]

        # Update output in place
        for i, s in enumerate(output):
            if s["title"] == title and s["artist"] == artist:
                output[i] = result
                break

        processed.add((title, artist))
        status = "✅" if snippet else "❌"
        print(f"[{idx}] {status} {title} – {artist}")

        # Save progress immediately
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

print("\n🎉 DONE! All songs updated in place:", OUTPUT_FILE)
