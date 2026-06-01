from fastapi import FastAPI, HTTPException

import json
from pathlib import Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

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

# Mapping of league names to their corresponding codes used in file names
LEAGUE_CODES = {
    "premier-league": "pl",
    "bundesliga": "bun",
    "la-liga": "laliga",
    "serie-a": "seriea",
    "ligue1": "ligue1",
}


@app.get("/test") # basic test endpoint
async def testapi():
    with open(JSON_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    return JSONResponse(
        content=data,
        status_code=200
    )


# Function returns the league table for a given league and season
@app.get("/league/{league_name}/{season}")
async def get_league(league_name: str, season: str):

    league_code = LEAGUE_CODES.get(league_name)

    if not league_code:
        raise HTTPException(status_code=404, detail="League not found")

    file_path = BASE_DIR / "data" / f"season{season}" / f"{league_code + '_s' + season}.json"
    # file path of leagues

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Season not found")

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data