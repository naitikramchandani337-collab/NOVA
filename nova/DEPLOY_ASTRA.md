# Deploying ASTRA to the Web

ASTRA needs two hosted pieces:

1. Backend API on Render
2. Frontend app on Vercel

## 1. Deploy the Backend on Render

Use `nova/backend/render.yaml` as the Render blueprint.

Important backend environment variables:

```env
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# Optional fallback provider
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama3-70b-8192

CORS_ORIGINS=["https://YOUR_FRONTEND_DOMAIN.vercel.app","http://localhost:5173","http://127.0.0.1:5173"]
ENVIRONMENT=production
DEBUG=false
```

After deploy, verify:

```text
https://YOUR_BACKEND_DOMAIN.onrender.com/health
https://YOUR_BACKEND_DOMAIN.onrender.com/api/astra/ping
```

## 2. Deploy the Frontend on Vercel

Set Vercel's project root to:

```text
nova/frontend
```

Set the frontend environment variable:

```env
VITE_API_URL=https://YOUR_BACKEND_DOMAIN.onrender.com
```

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

## 3. Connect Both Sides

After Vercel gives you the frontend URL, update Render's `CORS_ORIGINS` to include that exact URL.

Example:

```env
CORS_ORIGINS=["https://nova-ai.vercel.app","http://localhost:5173","http://127.0.0.1:5173"]
```

Then redeploy the backend.

## 4. Quick Smoke Test

Open the deployed frontend and ask ASTRA:

```text
Explain neural networks simply.
```

If ASTRA shows offline, check:

- Vercel has `VITE_API_URL` pointing at Render.
- Render has `CORS_ORIGINS` including the Vercel URL.
- Render has at least one AI key set: `OPENROUTER_API_KEY` or `GROQ_API_KEY`.
- `https://YOUR_BACKEND_DOMAIN.onrender.com/api/astra/ping` returns `ASTRA online`.
