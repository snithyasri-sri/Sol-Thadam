import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.services.dataset_loader import DatasetLoader
from app.services.sense_engine import SenseEngine
from app.services.quiz_service import QuizService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sol_thadam")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load dataset and initialize services
    logger.info("Starting Sol Thadam Tamil WSD Engine...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.getenv("TAMIL_WSD_CSV", os.path.join(base_dir, "data", "tamil_wsd_dataset.csv"))

    loader = DatasetLoader(csv_path=csv_path)
    loaded = loader.load()
    if not loaded:
        logger.error(f"Failed to load dataset from {csv_path}")
    else:
        logger.info(f"Successfully loaded dataset with {len(loader.records)} records.")

    engine = SenseEngine(loader)
    quiz_service = QuizService(loader)

    # Attach instances to routes
    routes.loader_instance = loader
    routes.engine_instance = engine
    routes.quiz_instance = quiz_service

    yield

    logger.info("Shutting down Sol Thadam service.")


app = FastAPI(
    title="சொல் தடம் — தமிழ் சூழல் சொல் பொருள் ஆய்வி API",
    description="Tamil Contextual Word Sense Disambiguation and Educational API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for frontend
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Allow custom origin via env if specified
env_origin = os.getenv("ALLOWED_ORIGIN")
if env_origin:
    allowed_origins.append(env_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(routes.router)


@app.get("/")
def root():
    return {
        "திட்டம்": "சொல் தடம் (Sol Thadam)",
        "விளக்கம்": "தமிழ் சூழல் சொல் பொருள் ஆய்வி (Tamil Contextual Word Meaning Explorer)",
        "ஆவணங்கள்": "/docs",
        "நிலை": "செயல்பாட்டில் உள்ளது"
    }
