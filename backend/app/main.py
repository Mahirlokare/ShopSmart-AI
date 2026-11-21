from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import CORS_ORIGINS
from .routes import auth, products, chat

app = FastAPI(title="ShopSmart AI API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS,
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message":"ShopSmart AI API is running"}

@app.get("/health")
async def health():
    return {"status":"ok"}
