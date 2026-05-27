from fastapi import FastAPI

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


@app.get("/")
async def root():
    return {"message": "Hello from FastAPI!"}

BASE_DIR = Path(__file__).resolve().parent
JSON_FILE = BASE_DIR / "test.json"

PremLeagueStandings24 = BASE_DIR / "pls.json"


@app.get("/test")
async def testapi():
    with open(JSON_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    return JSONResponse(
        content=data,
        status_code=200
    )

@app.get("/pl24")
async def testapi():
    with open(PremLeagueStandings24, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    return JSONResponse(
        content=data,
        status_code=200
    )