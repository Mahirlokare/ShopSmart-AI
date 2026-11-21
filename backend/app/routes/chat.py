import httpx
from fastapi import APIRouter, HTTPException
from ..config import GROQ_API_KEY, GROQ_MODEL
from ..schemas import ChatIn

router = APIRouter(prefix="/api/chat", tags=["assistant"])

@router.post("")
async def chat(data: ChatIn):
    if not GROQ_API_KEY:
        return {"reply":"The AI assistant is not configured yet. Add GROQ_API_KEY to your backend environment to enable product recommendations."}
    payload = {
        "model": GROQ_MODEL,
        "messages":[
            {"role":"system","content":"You are ShopSmart's friendly shopping assistant. Ask clarifying questions when useful. Never claim an item is in stock unless the user provides that information."},
            {"role":"user","content":data.message}
        ],
        "temperature":0.5,
        "max_tokens":500
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post("https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization":f"Bearer {GROQ_API_KEY}"}, json=payload)
    if response.is_error:
        raise HTTPException(502, "AI provider request failed")
    return {"reply":response.json()["choices"][0]["message"]["content"]}
