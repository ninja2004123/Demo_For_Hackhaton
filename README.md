# NexusIQ — Enterprise Intelligence Platform

A local-first enterprise knowledge platform powered by **Ollama** (llama3.1:8b). Employees can search company documents with AI, generate personalised onboarding guides, browse GitHub repositories, and query Azure DevOps — all with clearance-level access control and no data leaving your machine.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Ollama](https://ollama.com/) installed at `~/.local/bin/ollama`
- The `llama3.1:8b` model pulled locally

---

## 1. Start Ollama

Ollama must be running before the frontend can talk to it.

```bash
~/.local/bin/ollama serve
```

Ollama will listen on `http://localhost:11434`. Keep this terminal open (or run it in the background).

**Pull the model** (first time only):

```bash
~/.local/bin/ollama pull llama3.1:8b
```

**Check it is running:**

```bash
~/.local/bin/ollama list
# Should show: llama3.1:8b
```

---

## 2. Start the Frontend

In a separate terminal, from the project directory:

```bash
npm install       # first time only
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 3. Hosting Online for Free

Because Ollama runs a local LLM, "full" hosting requires two separate deployments: one for the frontend (static) and one for the Ollama backend (a server or VM).

### Frontend — Vercel (recommended, free)

The frontend builds to static files and deploys instantly.

1. Push the project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and import the repo.
3. Vercel auto-detects Vite — no config needed.
4. Deploy. You get a public HTTPS URL (e.g. `https://nexusiq.vercel.app`).

Alternatively use [Netlify](https://netlify.com) — same process.

> **Important:** After deploying the frontend, update the `OLLAMA_BASE` URL in `src/utils/anthropic.js` from `http://localhost:11434` to your backend's public URL (see below). Then redeploy.

### Ollama Backend — Fly.io (free tier)

Fly.io provides a free tier with enough CPU/RAM for llama3.1:8b.

1. Install the Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. Create a `Dockerfile` in the project root:

```dockerfile
FROM ollama/ollama
RUN ollama serve & sleep 5 && ollama pull llama3.1:8b && pkill ollama
EXPOSE 11434
CMD ["ollama", "serve"]
```

4. Launch the app:

```bash
fly launch --name nexusiq-ollama --region lhr
fly deploy
```

5. Note the public URL (e.g. `https://nexusiq-ollama.fly.dev`) and set it in `src/utils/anthropic.js`.

6. Enable CORS on Ollama by setting the `OLLAMA_ORIGINS` environment variable on Fly:

```bash
fly secrets set OLLAMA_ORIGINS="https://nexusiq.vercel.app"
```

> **Note on free tiers:** llama3.1:8b is a ~5 GB model and needs at least 8 GB RAM. Fly's free tier may be limited — consider using a smaller model like `llama3.2:3b` if you hit memory limits, or use a $5/month Fly machine.

### Alternative: Keep Ollama Local, Host Only the Frontend

If you only want teammates on the same network to use the app:

1. Deploy only the frontend to Vercel/Netlify.
2. Run `ollama serve` on a machine everyone can reach.
3. Point `OLLAMA_BASE` to that machine's local IP (e.g. `http://192.168.1.100:11434`).

This is simpler and keeps inference free forever.

---

## Project Structure

```
src/
  pages/
    AISearch.jsx        # Document Q&A with Ollama streaming
    OnboardingGuide.jsx # AI-generated 30-day onboarding plans
    GitHub.jsx          # GitHub repo browser + AI code Q&A
    AzureDevOps.jsx     # Azure DevOps project explorer + AI Q&A
    Dashboard.jsx       # Overview
    DocumentHub.jsx     # Upload and manage company documents
    AdminPanel.jsx      # User and clearance management
    Login.jsx / Register.jsx / CompanySelector.jsx
  utils/
    anthropic.js        # Ollama API client (streaming)
    clearance.js        # Role-based document access
    storage.js          # localStorage persistence
    seedData.js         # Demo data
  contexts/
    AuthContext.jsx     # Authentication state
    TenantContext.jsx   # Multi-tenant company state
```

---

## Key Details

| Item | Value |
|------|-------|
| Model | `llama3.1:8b` |
| Ollama port | `11434` |
| Dev server port | `5173` |
| Data storage | Browser `localStorage` (no backend DB) |
| Auth | Local (no external auth service) |
