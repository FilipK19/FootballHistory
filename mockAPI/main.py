from fastapi import FastAPI, HTTPException
import json
from pathlib import Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent
JSON_FILE = BASE_DIR / "test.json"


# Mapping of league names to their corresponding codes used in file names and API parameters
LEAGUES = {
    "premier-league": {
        "id": 39,
        "code": "pl"
    },
    "bundesliga": {
        "id": 78,
        "code": "bun"
    },
    "la-liga": {
        "id": 140,
        "code": "laliga"
    },
    "serie-a": {
        "id": 135,
        "code": "seriea"
    },
    "ligue1": {
        "id": 61,
        "code": "ligue1"
    }
}

# Create mappings for easy lookup by name and ID
LEAGUE_BY_NAME = LEAGUES
LEAGUE_BY_ID = {v["id"]: v for v in LEAGUES.values()}

# Load API key from .env file
load_dotenv()

# API key for football data, stored as an env
API_KEY = os.getenv("API_FOOTBALL_KEY")  # Store key as env variable
BASE_URL = "https://v3.football.api-sports.io"


@app.get("/test") # basic test endpoint
async def testapi():
    with open(JSON_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    return JSONResponse(
        content=data,
        status_code=200
    )



# Function returns the matches for a given league and season
@app.get("/matches/{league}/{season}")
async def get_matches(league: str, season: int):

    headers = {
        "x-apisports-key": API_KEY
    }

    league_id = LEAGUE_BY_NAME.get(league)
    league_code = league_id["code"]
    if not league_code:
        raise HTTPException(status_code=404, detail="League not found")

    season_short = str(season)[-2:]

    file_path = BASE_DIR / "data" / f"season{season_short}" / "matches" / f"{league_code + '_matches' + season_short}.json"

    def fetch_from_api():
        response = requests.get(
            f"{BASE_URL}/fixtures",
            headers=headers,
            params={
                "league": league_id["id"],
                "season": season
            }
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    result = get_cached_or_fetch(file_path, fetch_from_api)

    return result


# Function returns the standings for a given league and season, with caching mechanism to avoid unnecessary API calls
@app.get("/league/{league}/{season}")
async def get_standings(league: str, season: int):

    headers = {
        "x-apisports-key": API_KEY
    }

    league_id = LEAGUE_BY_NAME.get(league)
    league_code = league_id["code"]
    if not league_code:
        raise HTTPException(status_code=404, detail="League not found")

    season_short = str(season)[-2:]

    file_path = BASE_DIR / "data" / f"season{season_short}" / "standings" / f"{league_code}_s{season_short}.json"

    def fetch_from_api():
        response = requests.get(
            f"{BASE_URL}/standings",
            headers=headers,
            params={
                "league": league_id["id"],
                "season": season
            }
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    result = get_cached_or_fetch(file_path, fetch_from_api)

    return result


@app.get("/match_info/{league}/{season}/{match_id}")
async def get_match_info(league: str, season: int, match_id: int):

    headers = {
        "x-apisports-key": API_KEY
    }

    league_id = LEAGUE_BY_NAME.get(league)
    league_code = league_id["code"]
    if not league_code:
        raise HTTPException(status_code=404, detail="League not found")

    season_short = str(season)[-2:]

    file_path = BASE_DIR / "data" / f"season{season_short}" / "minfo" / f"{league_code}{season_short}_{match_id}.json"

    def fetch_from_api():
        response = requests.get(
            f"{BASE_URL}/fixtures",
            headers=headers,
            params={
                "id": match_id
            }
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()

    result = get_cached_or_fetch(file_path, fetch_from_api)

    return result


# Helper function to check for cached data and fetch from API if not available
def get_cached_or_fetch(file_path: Path, fetch_fn):
    if file_path.exists():
        print(f"[CACHE] Using existing file: {file_path}")
        with open(file_path, "r", encoding="utf-8") as f:
            return {
                "source": "cache",
                "data": json.load(f)
            }

    print(f"[API] File not found. Fetching and saving: {file_path}")

    data = fetch_fn()

    file_path.parent.mkdir(parents=True, exist_ok=True)

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    return {
        "source": "api",
        "data": data
    }