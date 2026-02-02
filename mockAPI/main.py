from fastapi import FastAPI

import json
from pathlib import Path
from fastapi.responses import JSONResponse

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

BASE_DIR = Path(__file__).resolve().parent
JSON_FILE = BASE_DIR / "test.json"


@app.get("/test")
async def testapi():
    with open(JSON_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    return JSONResponse(
        content=data,
        status_code=200
    )