import billboard
import json
import datetime
import time
import os

OUTPUT_FILE = "billboard_hot25.json"


def load_existing_data():
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r") as f:
            return json.load(f)
    return []


def save_data(data):
    with open(OUTPUT_FILE, "w") as f:
        json.dump(list(data.values()), f, indent=2)


def get_all_weeks(start_year=1958):
    dates = []
    start = datetime.date(start_year, 8, 2)  # first Hot 100 chart
    today = datetime.date.today()

    while start <= today:
        dates.append(start.strftime("%Y-%m-%d"))
        start += datetime.timedelta(days=30)

    return dates


def scrape_top25_highest_rank():
    existing_list = load_existing_data()
    # Use a dict to track songs by (title, artist) for easy updating
    songs = {
        (item["title"], item["artist"]): item
        for item in existing_list
    }

    all_weeks = get_all_weeks()
    print(f"Weeks to fetch: {len(all_weeks)}")

    for date in all_weeks:
        print(f"Fetching chart for {date}...")

        try:
            chart = billboard.ChartData("hot-100", date=date)
        except Exception as e:
            print("Error: ", e)
            print("Retrying in 2 seconds...")
            time.sleep(2)
            continue

        # Only top 25
        for entry in chart[:25]:
            key = (entry.title, entry.artist)
            if key not in songs:
                # New song
                songs[key] = {
                    "title": entry.title,
                    "artist": entry.artist,
                    "week_first_seen": date,
                    "year_first_seen": date.split("-")[0],
                    "highest_rank": entry.rank
                }
            else:
                # Update highest rank if current rank is better
                if entry.rank < songs[key]["highest_rank"]:
                    songs[key]["highest_rank"] = entry.rank

        save_data(songs)
        time.sleep(0.2)

    return list(songs.values())


if __name__ == "__main__":
    print("Starting unique Billboard Top 25 scrape with highest rank tracking…")
    songs = scrape_top25_highest_rank()
    print(f"Done! Total unique songs saved: {len(songs)}")
