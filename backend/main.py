import os
import json
import base64
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

AI_API_KEY = os.getenv("AI_API_KEY")
AI_BASE_URL = os.getenv("AI_BASE_URL")
TEXT_MODEL = os.getenv("TEXT_MODEL_ID")
VISION_MODEL = os.getenv("VISION_MODEL_ID")

client = OpenAI(base_url=AI_BASE_URL, api_key=AI_API_KEY)
app = FastAPI(title="DormMate AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    query: str
    profile: dict

class PlanRequest(BaseModel):
    profile: dict
    duration_days: int = 7

class SubstituteRequest(BaseModel):
    ingredient: str
    recipe_title: str
    profile: dict

try:
    with open("../src/data/recipes.json", "r") as f:
        RECIPES_DB = json.load(f)
except FileNotFoundError:
    RECIPES_DB = []

# =============================================================================
# 🚨 THE FIX FOR YOUR MEAL PLAN PAGE 🚨
# =============================================================================
@app.post("/")
async def root_proxy(request: PlanRequest):
    """
    This handles the requests from your 'old' MealPlanPage 
    that calls the root URL instead of /plan-week.
    """
    return await plan_week(request)

# =============================================================================
# STANDARD ENDPOINTS
# =============================================================================

@app.post("/recommend")
async def recommend(request: RecommendationRequest):
    try:
        system_prompt = "You are the DormMate AI Engine. Respond ONLY with JSON. Format: {\"type\": \"recommendation\", \"results\": [{\"id\": 1, \"reason\": \"...\"}]} OR {\"type\": \"generated\", \"recipe\": {...}}"
        user_prompt = f"USER PROFILE: {json.dumps(request.profile)}\nRECIPE DATABASE: {json.dumps(RECIPES_DB)}\nUSER QUERY: {request.query}"
        response = client.chat.completions.create(
            model=TEXT_MODEL,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.7,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/plan-week")
async def plan_week(request: PlanRequest):
    try:
        system_prompt = "You are the DormMate AI Meal Planner. Respond ONLY with JSON. Format: {\"plan\": [{\"day\": \"Monday\", \"meal\": \"Recipe Name\", \"cost\": 100, \"reason\": \"...\"}, ...]}"
        user_prompt = f"USER PROFILE: {json.dumps(request.profile)}. Create a {request.duration_days}-day plan."
        response = client.chat.completions.create(
            model=TEXT_MODEL,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.7,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/substitute")
async def substitute(request: SubstituteRequest):
    try:
        system_prompt = "You are the DormMate AI Kitchen Assistant. Respond ONLY with JSON. Format: {\"substitute\": \"Ingredient Name\", \"reason\": \"...\"}"
        user_prompt = f"RECIPE: {request.recipe_title}. MISSING: {request.ingredient}. USER PROFILE: {json.dumps(request.profile)}."
        response = client.chat.completions.create(
            model=TEXT_MODEL,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.3,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scan-pantry")
async def scan_pantry(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        response = client.chat.completions.create(
            model=VISION_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "List only the food ingredients you see in this image. Respond ONLY as a comma-separated list. Example: Eggs, Tomato, Onion, Rice."},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}},
                    ],
                }
            ],
            max_tokens=300,
        )
        ingredients_text = response.choices[0].message.content
        return {"ingredients": [i.strip() for i in ingredients_text.split(",")]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
