from abc import ABC, abstractmethod
from pathlib import Path

from PIL import Image

from config import Settings, BrandConfig
from src.utils.color import hex_to_rgb


class BaseGenerator(ABC):
    """Base class for all asset generators."""

    def __init__(self, settings: Settings, brand: BrandConfig):
        self.settings = settings
        self.brand = brand

    def _create_canvas(self, width: int, height: int) -> Image.Image:
        bg_color = hex_to_rgb(self.brand.colors["background"])
        return Image.new("RGB", (width, height), bg_color)

    def _resolve_output_path(
        self, output_path: str | None, prefix: str, ext: str | None = None
    ) -> Path:
        ext = ext or self.settings.OUTPUT_FORMAT
        if output_path:
            return Path(output_path)
        return self.settings.OUTPUT_DIR / f"{prefix}.{ext}"

    def _save(self, image: Image.Image, path: Path) -> Path:
        path.parent.mkdir(parents=True, exist_ok=True)
        image.save(str(path), quality=self.settings.OUTPUT_QUALITY)
        return path

    @abstractmethod
    def generate(self, **kwargs) -> Path:
        """Generate the marketing asset. Must be implemented by subclasses."""
        ...
