# Nepfluence
It is a digital platform that connects brands with influencers to collaborate on marketing and promotion campaigns.

Nepfluence/
├── backend/                    FastAPI microservice (Python)
│   ├── src/
│   │   ├── main.py                        FastAPI app setup + CORS + middleware
│   │   ├── config.py                      Settings from environment
│   │   ├── database.py                    SQLAlchemy engine, Base models
│   │   ├── auth.py                        JWT/password utilities
│   │   ├── email_utils.py                 SMTP email sending
│   │   ├── google_auth.py                 OAuth 2.0 Google sign-in
│   │   ├── users/                         User models, auth routes, JWT handlers
│   │   ├── brand_profile/                 Brand profiles, routes, schemas
│   │   ├── influencer_profile/            Creator/influencer profiles
│   │   ├── campaign/                      Campaign CRUD, application logic
│   │   ├── campaign_proposal/             Proposal workflows
│   │   ├── marketplace/                   Discovery & matching
│   │   ├── contact/                       Contact form endpoints
│   │   ├── integrations/youtube/          YouTube integration
│   │   └── integrations/                  Third-party APIs
│   ├── pyproject.toml                     Dependencies (FastAPI, SQLAlchemy, etc.)
│   ├── .env.example                       Config template
│   └── uv.lock                            Dependency lock file
│
└── frontend/                   Next.js 16 with TypeScript (Node.js)
    ├── app/                               Next.js App Router (routing & layouts)
    │   ├── (auth)/                        Auth route group (login, register)
    │   ├── (brand)/                       Brand workspace (protected)
    │   ├── brand/dashboard                Brand dashboard
    │   ├── creator/dashboard              Creator dashboard
    │   ├── collabs_manager/               Collaboration management UI
    │   ├── pricing/                       Pricing page
    │   ├── about/                         About page
    │   ├── layout.tsx                     Root layout (wraps all pages)
    │   ├── page.tsx                       Home page (landing)
    │   └── globals.css                    Global TailwindCSS styles
    │
    ├── features/                          Domain-oriented feature modules (business logic)
    │   ├── auth/                          Login, signup, JWT handling
    │   ├── campaigns/                     Campaign creation, browsing, UI components
    │   ├── creator/                       Creator discovery, profiles
    │   ├── creator-profile/               Creator profile editing
    │   ├── brand-profile/                 Brand profile management
    │   ├── home/                          Landing page components
    │   ├── collaboration/                 Collab workflows
    │   ├── payments/                      Payment & escrow UIs
    │   ├── notifications/                 Notification logic
    │   ├── trust/                         Trust & verification
    │   ├── account/                       Account settings
    │   └── shared/                        Shared types, utilities between features
    │
    ├── components/                        Reusable, non-business components
    │   ├── ui/                            Primitives: buttons, inputs, cards (shadcn-style)
    │   ├── Layout/                        Public layout pieces (Navbar, Footer)
    │   └── gooey-input-demo.tsx           Demo component
    │
    ├── lib/                               Infrastructure & helpers
    │   ├── api-client.ts                  HTTP client for backend calls
    │   ├── auth.ts                        Auth utilities (tokens, session)
    │   ├── websocket.ts                   WebSocket client setup
    │   ├── validators/                    Input validation helpers
    │   └── utils.ts                       Class/style utilities (clsx, cn)
    │
    ├── types/                             Shared types (cross-domain)
    │   ├── api.types.ts                   API request/response types
    │   └── common.types.ts                Shared domain types
    │
    ├── public/                            Static assets
    ├── package.json                       Dependencies (Next, React, TailwindCSS, etc.)
    ├── tsconfig.json                      TypeScript config
    ├── ARCHITECTURE.md                    Feature architecture doc (boundary rules)
    ├── AGENTS.md                          AI agent instructions
    └── README.md                          Frontend setup & scripts