import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("AI_BASE_URL", "https://api.fireworks.ai/inference/v1"),
    api_key=os.getenv("AI_API_KEY")
)
MODEL_ID = os.getenv("AI_MODEL_ID", "accounts/fireworks/models/gemma-4-26b-a4b-it")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    query: str
    profile: dict

try:
    with open("../src/data/recipes.json", "r") as f:
        RECIPES_DB = json.load(f)
except:
    RECIPES_DB = []

@app.post("/recommend")
async def recommend(request: RecommendationRequest):
    try:
        system_prompt = (
            "You are the DormMate AI Engine. Expert in student nutrition. "
            "RULES: \n"
            "1. SAFETY: No ingredients from user allergies.\n"
            "2. EQUIPMENT: Use only tools user has.\n"
            "3. OUTPUT: Respond ONLY in JSON.\n"
            "   If existing: {\"type\": \"recommendation\", \"results\": [{\"id\": 1, \"reason\": \"...\", \"image_query\": \"chicken curry\"}]}\n"
            "   If generating: {\"type\": \"generated\", \"recipe\": {\"title\": \"...\", \"ingredients\": [], \"steps\": [], \"estimatedCost\": 100, \"calories\": 400, \"protein\": 20, \"cookingTime\": 15, \"difficulty\": \"Easy\", \"aiReason\": \"...\", \"image_query\": \"cucumber snack\"}}"
        )

        user_prompt = f"USER PROFILE: {json.dumps(request.profile)}\nRECIPE DB: {json.dumps(RECIPES_DB)}\nQUERY: {request.query}"

        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        ai_content = response.choices[0].message.content
        if "```json" in ai_content:
            ai_content = ai_content.split("```json")[1].split("```")[0].strip()
        
        return json.loads(ai_content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
