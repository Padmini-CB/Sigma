from pathlib import Path

from PIL import Image, ImageDraw

from config import Settings, BrandConfig
from src.generators.base import BaseGenerator
from src.utils.color import hex_to_rgb
from src.utils.text import draw_text_centered


class ThumbnailGenerator(BaseGenerator):
    """Generate thumbnail images for YouTube and other platforms."""

    def __init__(self, settings: Settings, brand: BrandConfig):
        super().__init__(settings, brand)

    def generate(
        self,
        title: str,
        platform: str = "youtube",
        output_path: str | None = None,
    ) -> Path:
        dim_key = f"{platform}_thumbnail"
        width, height = self.settings.PLATFORM_DIMENSIONS.get(
            dim_key, (1280, 720)
        )

        canvas = self._create_canvas(width, height)
        draw = ImageDraw.Draw(canvas)

        # Draw gradient overlay
        primary = hex_to_rgb(self.brand.colors["primary"])
        for y in range(height):
            alpha = y / height
            color = tuple(int(primary[i] * alpha) for i in range(3))
            draw.line([(0, y), (width, y)], fill=color)

        # Draw title text
        draw_text_centered(
            draw,
            title,
            canvas.size,
            color=self.brand.colors["text_primary"],
            font_name=self.brand.typography["heading_font"],
        )

        path = self._resolve_output_path(output_path, f"thumbnail_{platform}")
        return self._save(canvas, path)
