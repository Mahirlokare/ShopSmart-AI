# Backend API

FastAPI service for ShopSmart AI.

- GET /health — health check
- POST /api/auth/register and POST /api/auth/login — JWT authentication
- GET /api/products — public catalogue
- POST/PUT/DELETE /api/products — admin-only product management
- POST /api/chat — Groq-powered assistant (optional API key)

Install requirements.txt and run uvicorn app.main:app --reload.
