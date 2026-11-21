# ShopSmart AI — AI-Powered E-commerce

A full-stack e-commerce demo built with React, FastAPI, MongoDB, and Groq LLM. Features a responsive storefront, JWT authentication, product catalog management, shopping cart, admin product CRUD, image uploads, and an AI shopping assistant.

## Run with Docker
1. Copy `.env.docker.example` to `.env`.
2. Set a strong `JWT_SECRET` (at least 32 characters). Optionally add `GROQ_API_KEY`.
3. Run `docker compose up --build`.
4. Open http://localhost:5173 (API docs: http://localhost:8000/docs).

See the project archive for full source code and setup instructions. Payments and order fulfillment are not implemented; this is a development/demo project, not a production-certified store.
