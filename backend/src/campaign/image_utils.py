import os
import uuid

from PIL import Image
from io import BytesIO

MEDIA_DIR = "media/brand_post"


def ensure_media_dir() -> None:
    os.makedirs(MEDIA_DIR, exist_ok=True)


def process_campaign_image(content: bytes) -> str:
    """
    Validates and saves image. Returns stored filename.
    """
    ensure_media_dir()

    img = Image.open(BytesIO(content))
    img = img.convert("RGB")  # normalize

    filename = f"{uuid.uuid4().hex}.jpg"
    path = os.path.join(MEDIA_DIR, filename)
    img.save(path, format="JPEG", quality=85)

    return filename


def delete_campaign_image(filename: str) -> None:
    path = os.path.join(MEDIA_DIR, filename)
    if os.path.exists(path):
        os.remove(path)