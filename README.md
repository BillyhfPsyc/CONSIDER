# CONSIDER

CONSIDER is an AI-powered reflection platform for structured disagreement on polarised topics.

Instead of forcing consensus, CONSIDER helps users:
1. clarify their own position,
2. engage with principled counterarguments, and
3. reflect on where and why disagreement persists.

It is designed as a browser-based MVP with a modular LLM backend and post-conversation analysis outputs.

---

## Features

- Three-stage flow: **Clarification → Conversation → Contemplation**
- Configurable disagreement intensity for debate behaviour
- AI-generated counter-position profile tailored to oppose the user's stated stance
- Optional specific focus — ground the debate in a concrete case rather than an abstract topic
- Structured post-conversation analysis:
  - key disagreements and agreements
  - potential common ground
  - nature and root of the disagreement
  - moral foundations scoring (Haidt)
  - epistemic humility rating
- Reviewable discussion transcript inline on the results page
- Multi-provider LLM support (GPT, Llama from TogetherAI & OpenRouter)
- Frontend + backend separation for easy iteration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Node.js + Express |
| Database | MongoDB |
| Chat model | OpenAI (`gpt-4o-mini`) or Llama (`Llama-3.3-70B`) |
| Analysis model | Claude (`claude-sonnet-4-5`) via OpenRouter + `gpt-4o` for extraction |

---

## Repository Structure

```text
CONSIDER/
├── frontend/                        # React/Vite client
│   ├── src/
│   │   ├── App.jsx                  # Routes
│   │   ├── api.js                   # Axios API calls
│   │   ├── prompts.js               # Client-side prompt builders
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Access.jsx               # Password gate
│   │   ├── DebateIntro.jsx          # Intro screen
│   │   ├── RVDSelect.jsx            # Topic selection
│   │   ├── toggle.jsx               # Disagreeability + focus config
│   │   ├── CurrentPosition.jsx      # Position clarification chat
│   │   ├── Chat.jsx                 # Debate chat interface
│   │   ├── Results.jsx              # Post-conversation analysis
│   │   └── components/
│   │       └── chat/
│   │           ├── ChatInput.jsx
│   │           └── MessageBubble.jsx
│   └── package.json
│
└── backend/                         # Express API + model orchestration
    ├── server.js                    # Entry point, middleware, route mounting
    ├── connect.js                   # MongoDB connection
    ├── chatRoutes.js                # /chat and /generate-profile endpoints
    ├── analysisRoutes.js            # /analyze-conversation endpoint
    ├── analysisPrompt.js            # Analysis prompt builders
    ├── config.env.example           # Environment variable template
    └── package.json
```

---

## User Flow

```
/access           → password gate
/                 → landing page
/debate-intro     → explains the format
/select-rvd       → user picks a topic
/toggle           → sets disagreeability level + optional specific focus
/current-position → clarification chat (AI extracts user's position)
/play             → debate chat (AI argues the opposing side)
/results          → full post-conversation analysis
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account (or local MongoDB instance)
- API keys for at least one LLM provider (see below)

---

### 1. Clone the repository

```bash
git clone https://github.com/BillyhfPsyc/CONSIDER.git
cd CONSIDER
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Copy the environment variable template:

```bash
cp config.env.example config.env
```

Then fill in `config.env`:

```env
# MongoDB
ATLAS_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/Consider

# LLM provider for chat ('openai' or 'together')
LLM_PROVIDER=openai

# OpenAI (required if LLM_PROVIDER=openai)
OPENAI_API_KEY=sk-...

# Together AI (required if LLM_PROVIDER=together)
TOGETHER_API_KEY=...

# OpenRouter (required for analysis — always used regardless of LLM_PROVIDER)
OPENROUTER_API_KEY=...

# Server
PORT=3001

# CORS — set to your frontend's origin
FRONTEND_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm start
```

The server will run on `http://localhost:3001` by default.

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:3001
VITE_SITE_PASSWORD=your-chosen-password
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Reference

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Send a message in either clarification or debate context |
| `POST` | `/generate-profile` | Generate a fictional AI opponent profile based on the user's position |

### Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze-conversation` | Run full post-conversation analysis on a completed debate |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check (used by Render keepalive) |

---

## LLM Providers

CONSIDER is designed to work with multiple LLM providers:

**Chat (debate + clarification):**
- `openai` — uses `gpt-4o-mini`
- `together` — uses `meta-llama/Llama-3.3-70B-Instruct-Turbo`

Switch between them with the `LLM_PROVIDER` environment variable.

**Analysis:**
Always routed via OpenRouter. Uses:
- `anthropic/claude-sonnet-4-5` for philosophical analysis
- `openai/gpt-4o` for structured data extraction

---

## Environment Variables — Full Reference

### Backend (`backend/config.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `ATLAS_URI` | Yes | MongoDB connection string |
| `OPENAI_API_KEY` | If `LLM_PROVIDER=openai` | OpenAI API key |
| `TOGETHER_API_KEY` | If `LLM_PROVIDER=together` | Together AI API key |
| `OPENROUTER_API_KEY` | Yes | OpenRouter key (for analysis) |
| `LLM_PROVIDER` | No | `openai` (default) or `together` |
| `PORT` | No | Server port (default: `3001`) |
| `FRONTEND_ORIGIN` | Yes | Frontend URL for CORS |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend URL (default: `http://localhost:3001`) |
| `VITE_SITE_PASSWORD` | No | Site access password (default: `test-password`) |

---

## Deployment

The project is structured for straightforward deployment:

- **Frontend** — deploy the `frontend/` directory to [Vercel](https://vercel.com). Set `VITE_API_URL` to your deployed backend URL in the Vercel environment settings.
- **Backend** — deploy the `backend/` directory to [Render](https://render.com) as a Node.js web service. Add all `config.env` variables as environment variables in the Render dashboard. The `/health` endpoint is used for keepalive pings.

---

## Contributing

This is an early-stage MVP. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## License

MIT
