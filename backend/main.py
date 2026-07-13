import os
import json
import base64
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# =============================================================================
# 1. CONFIGURATION
# =============================================================================
load_dotenv()

AI_API_KEY = os.getenv("AI_API_KEY")
AI_BASE_URL = os.getenv("AI_BASE_URL")
TEXT_MODEL = os.getenv("TEXT_MODEL_ID")
VISION_MODEL = os.getenv("VISION_MODEL_ID")

if not AI_API_KEY:
    print("❌ FATAL ERROR: AI_API_KEY missing in .env")
    exit(1)

# Groq Client (OpenAI compatible)
client = OpenAI(
    base_url=AI_BASE_URL,
    api_key=AI_API_KEY
)

app = FastAPI(title="DormMate AI Groq-Powered Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# 2. DATA MODELS & DATABASE
# =============================================================================
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
# 3. REASONING ENDPOINTS (Llama 3.3 - High Intelligence)
# =============================================================================

@app.post("/recommend")
async def recommend(request: RecommendationRequest):
    try:
        system_prompt = (
            "You are the DormMate AI Engine. You MUST respond ONLY with a valid JSON object. "
            "Rules: No allergies, match equipment, check DB first, then generate. "
            "Format: {\"type\": \"recommendation\", \"results\": [{\"id\": 1, \"reason\": \"...\"}]} "
            "OR {\"type\": \"generated\", \"recipe\": {\"title\": \"...\", \"ingredients\": [], \"steps\": [], \"estimatedCost\": 100, \"calories\": 400, \"protein\": 20, \"cookingTime\": 15, \"difficulty\": \"Easy\", \"aiReason\": \"...\"}}"
        )
        user_prompt = f"USER PROFILE: {json.dumps(request.profile)}\nRECIPE DATABASE: {json.dumps(RECIPES_DB)}\nUSER QUERY: {request.query}"
        
        response = client.chat.completions.create(
            model=TEXT_MODEL,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.7,
            # Groq doesn't always support response_format={"type": "json_object"}, 
            # so we emphasize it in the system prompt.
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Recommend Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/plan-week")
async def plan_week(request: PlanRequest):
    try:
        system_prompt = (
            "You are the DormMate AI Meal Planner. You MUST respond ONLY with a valid JSON object. "
            "Format: {\"plan\": [{\"day\": \"Monday\", \"meal\": \"Recipe Name\", \"cost\": 100, \"reason\": \"...\"}, ...]}"
        )
        user_prompt = f"USER PROFILE: {json.dumps(request.profile)}. Create a {request.duration_days}-day plan."
        
        response = client.chat.completions.create(
            model=TEXT_MODEL,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.7,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Plan Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/substitute")
async def substitute(request: SubstituteRequest):
    try:
        system_prompt = (
            "You are the DormMate AI Kitchen Assistant. You MUST respond ONLY with a valid JSON object. "
            "Format: {\"substitute\": \"Ingredient Name\", \"reason\": \"...\"}"
        )
        user_prompt = f"RECIPE: {request.recipe_title}. MISSING: {request.ingredient}. USER PROFILE: {json.dumps(request.profile)}."
        
        response = client.chat.completions.create(
            model=TEXT_MODEL,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.3,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Substitute Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# 4. VISION ENDPOINT (LLaVA - Fast Multimodal)
# =============================================================================

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
                        {"type": "text", "text": "List only the food ingredients you see in this image. Respond ONLY as a comma-separated list. Example: Eggs, Tomato, Onion, Rice. No conversational text."},
                        {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                        },
                    ],
                }
            ],
            max_tokens=300,
        )

        ingredients_text = response.choices[0].message.content
        ingredients_list = [i.strip() for i in ingredients_text.split(",")]

        return {"ingredients": ingredients_list}

    except Exception as e:
        print(f"Vision Error: {e}")
        raise HTTPException(status_code=500, detail=f"Vision AI failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
