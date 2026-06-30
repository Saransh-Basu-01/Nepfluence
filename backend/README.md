src/
│
├── core/
│   ├── config.py
│   ├── security.py
│   ├── database.py
│   ├── email.py
│   └── dependencies.py
│
├── users/
│   ├── models.py
│   ├── schemas.py
│   ├── routes.py
│   ├── services.py
│   └── utils.py
│
├── influencer_profiles/
│   ├── models.py
│   ├── schemas.py
│   ├── routes.py
│   └── services.py
│
├── brand_profiles/
│   ├── models.py
│   ├── schemas.py
│   ├── routes.py
│   └── services.py
│
├── campaigns/
│   ├── models.py
│   ├── schemas.py
│   ├── routes.py
│   └── services.py
│
├── auth/
│   ├── jwt.py
│   ├── password.py
│   ├── dependencies.py
│   └── routes.py
│
├── media/
│
├── main.py
│
└── alembic/





backend/
├── .venv/
├── media/                    # user uploads
├── src/
│   ├── __init__.py
│   ├── main.py               # app = FastAPI()
│   ├── config.py             # settings from .env
│   ├── database.py           # engine, SessionLocal, get_db
│   ├── models.py             # 👈 OPTION A: all SQLAlchemy models in one file
│   │   # OR keep separate folders but import safely
│   ├── users/
│   │   ├── __init__.py
│   │   ├── models.py         # User, BrandProfile, InfluencerProfile
│   │   ├── schemas.py        # Pydantic (UserCreate, UserOut, Token)
│   │   ├── routes.py         # register, login, get profile, update
│   │   └── utils.py          # password hashing, JWT helpers
│   ├── campaigns/
│   │   ├── __init__.py
│   │   ├── models.py         # Campaign, Deliverable, Application, Submission
│   │   ├── schemas.py
│   │   ├── routes.py         # create campaign, list feed, apply, accept
│   │   └── services.py       # matching logic (optional)
│   ├── messages/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routes.py
│   ├── payments/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routes.py
│   └── core/
│       ├── dependencies.py   # get_current_user, require_role
│       ├── security.py       # JWT create/decode, hash/verify password
│       └── exceptions.py
├── .env
├── nepfluence.db
└── requirements.txt