from google_play_scraper import reviews
import pandas as pd
import os

APP_ID = "com.global.foodpanda.android"

result, _ = reviews(
    APP_ID,
    country="pk",
    count=8000
)

df = pd.DataFrame(result)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")

os.makedirs(DATA_DIR, exist_ok=True)

output_path = os.path.join(DATA_DIR, "raw_reviews.csv")
df.to_csv(output_path, index=False)

print(f"Saved {len(df)} raw reviews to {output_path}")
