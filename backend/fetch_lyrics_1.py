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
GOOGLE_DELAY = 0.8  # seconds between google attempts (prevents blocking)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
}

# ----------------------------------------
# Load existing progress
# ----------------------------------------
with open(SONGS_FILE, "r", encoding="utf-8") as f:
    songs = json.load(f)

if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
        output = json.load(f)
else:
    output = []

processed = set((s["title"].strip(), s["artist"].strip()) for s in output)

print(f"▶ Loaded {len(songs)} songs")
print(f"▶ Already processed: {len(processed)}")
print("──────────────────────────────────────\n")


# ----------------------------------------
# Helper – sanitize song titles to try variants
# ----------------------------------------
def generate_title_variants(title):
    variants = {title}

    # remove parentheses
    no_paren = re.sub(r"\(.*?\)", "", title).strip()
    variants.add(no_paren)

    # remove punctuation
    no_punct = re.sub(r"[^A-Za-z0-9 ]+", "", title)
    variants.add(no_punct)

    # remove “feat” etc
    variants.add(re.sub(r"feat.*", "", title, flags=re.I).strip())

    return [v for v in variants if v]


# ----------------------------------------
# Fallback 1 — try lyrics.ovh API
# ----------------------------------------
def try_lyrics_api(artist, title):
    try:
        url_artist = artist.replace(" ", "%20")
        url_title = title.replace(" ", "%20")
        url = f"https://api.lyrics.ovh/v1/{url_artist}/{url_title}"

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


# ----------------------------------------
# Fallback 2 — Google snippet scraper
# ----------------------------------------
def try_google_scrape(artist, title):
    query = f"{title} {artist} lyrics"
    url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

    time.sleep(GOOGLE_DELAY)  # important rate-limit

    try:
        html = requests.get(url, headers=headers, timeout=4).text

        # Look for common lyric snippet pattern
        match = re.search(r'<span class="hgKElc">(.+?)</span>', html)
        if match:
            snippet = match.group(1)
            snippet = snippet.replace("<br>", "\n").strip()
            return snippet[:200]  # safe snippet size

    except:
        pass

    return None


# ----------------------------------------
# Fetch lyrics for ONE song
# ----------------------------------------
def process_song(song):
    title = song["title"].strip()
    artist = song["artist"].strip()

    key = (title, artist)
    if key in processed:
        return None  # skip

    variants = generate_title_variants(title)

    for variant in variants:
        for attempt in range(MAX_RETRIES):

            # 1) Try lyrics.ovh
            snippet = try_lyrics_api(artist, variant)
            if snippet:
                return {
                    **song,
                    "lyrics_snippet": snippet
                }

            # 2) Try Google
            snippet = try_google_scrape(artist, variant)
            if snippet:
                return {
                    **song,
                    "lyrics_snippet": snippet
                }

    # No luck
    return {
        **song,
        "lyrics_snippet": None
    }


# ----------------------------------------
# Process in parallel
# ----------------------------------------
new_entries = []

with ThreadPoolExecutor(max_workers=THREADS) as executor:
    futures = {executor.submit(process_song, s): s for s in songs}

    for idx, future in enumerate(as_completed(futures), 1):
        result = future.result()
        if result is None:
            continue  # skipped

        title = result["title"]
        artist = result["artist"]
        snippet = result["lyrics_snippet"]

        if snippet:
            print(f"[{idx}] ✅ {title} – {artist}")
        else:
            print(f"[{idx}] ❌ {title} – {artist}")

        output.append(result)
        processed.add((title, artist))

        # save progress immediately
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)


print("\n🎉 DONE! Saved:", OUTPUT_FILE)
