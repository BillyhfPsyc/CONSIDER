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
  - political/ideological positioning
- Reviewable discussion transcript inline on the results page
- Multi-provider LLM support (OpenAI, Together AI, OpenRouter)
- Frontend + backend separation for easy iteration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Node.js + Express 5 |
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
