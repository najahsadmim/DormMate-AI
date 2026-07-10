import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

# Configure AI Client
client = OpenAI(
    base_url=os.getenv("AI_BASE_URL"),
    api_key=os.getenv("AI_API_KEY")
)
MODEL_ID = os.getenv("AI_MODEL_ID")

app = FastAPI()

# Enable CORS for React communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
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

# Load recipes once at startup
try:
    with open("../src/data/recipes.json", "r") as f:
        RECIPES_DB = json.load(f)
except FileNotFoundError:
    RECIPES_DB = []
    print("Warning: recipes.json not found.")

@app.post("/recommend")
async def recommend(request: RecommendationRequest):
    try:
        system_prompt = (
            "You are the DormMate AI Engine. Expert in student nutrition and budget. "
            "RULES: \n"
            "1. SAFETY: NEVER suggest ingredients the user is allergic to.\n"
            "2. EQUIPMENT: Only suggest recipes matching user's tools. If none, suggest 'no-cook' meals.\n"
            "3. LOGIC: First, check the RECIPE DATABASE. If no perfect match, GENERATE a new recipe.\n"
            "4. OUTPUT: Respond ONLY with a JSON object: "
            "{\"type\": \"recommendation\", \"results\": [{\"id\": 1, \"reason\": \"...\"}]} "
            "OR {\"type\": \"generated\", \"recipe\": {\"title\": \"...\", \"ingredients\": [], \"steps\": [], \"estimatedCost\": 100, \"calories\": 400, \"protein\": 20, \"cookingTime\": 15, \"difficulty\": \"Easy\", \"aiReason\": \"...\"}}"
        )
        user_prompt = f"USER PROFILE: {json.dumps(request.profile)}\nRECIPE DATABASE: {json.dumps(RECIPES_DB)}\nUSER QUERY: {request.query}"
        
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/plan-week")
async def plan_week(request: PlanRequest):
    try:
        system_prompt = (
            "You are the DormMate AI Meal Planner. Create a balanced 7-day meal plan. "
            "RULES: \n"
            "1. Budget: Total weekly cost must fit user's budget preference.\n"
            "2. Nutrition: Align with user's nutrition goal.\n"
            "3. OUTPUT: Respond ONLY with JSON: {\"plan\": [{\"day\": \"Monday\", \"meal\": \"Recipe Name\", \"cost\": 100, \"reason\": \"...\"}, ...]}"
        )
        user_prompt = f"USER PROFILE: {json.dumps(request.profile)}. Create a {request.duration_days}-day plan."
        
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/substitute")
async def substitute(request: SubstituteRequest):
    try:
        system_prompt = (
            "You are the DormMate AI Kitchen Assistant. Suggest a substitution for a missing ingredient. "
            "RULES: \n"
            "1. Context: The substitute must work for the specific recipe provided.\n"
            "2. Profile: Ensure the substitute doesn't trigger user allergies.\n"
            "3. OUTPUT: Respond ONLY with JSON: {\"substitute\": \"Ingredient Name\", \"reason\": \"...\"}"
        )
        user_prompt = f"RECIPE: {request.recipe_title}. MISSING: {request.ingredient}. USER PROFILE: {json.dumps(request.profile)}."
        
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
