from fastapi import FastAPI
import httpx

app = FastAPI()

MOCKAPI = "http://localhost:8001/pl24"


@app.get("/")
async def root():
    return {"message": "Hello World"}



@app.get("/test")
async def get_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(MOCKAPI)
    
    return response.json()