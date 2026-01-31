import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings:
    """Application-wide settings loaded from environment variables."""

    OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", BASE_DIR / "output"))
    OUTPUT_FORMAT = os.getenv("OUTPUT_FORMAT", "png")
    OUTPUT_QUALITY = int(os.getenv("OUTPUT_QUALITY", "95"))

    ASSETS_DIR = BASE_DIR / "assets"
    TEMPLATES_DIR = BASE_DIR / "templates"

    SUPPORTED_FORMATS = ("png", "jpg", "webp", "pdf")

    PLATFORM_DIMENSIONS = {
        "youtube_thumbnail": (1280, 720),
        "youtube_banner": (2560, 1440),
        "instagram_post": (1080, 1080),
        "instagram_story": (1080, 1920),
        "instagram_carousel": (1080, 1080),
        "linkedin_post": (1200, 627),
        "linkedin_banner": (1584, 396),
        "twitter_post": (1200, 675),
        "twitter_header": (1500, 500),
    }
