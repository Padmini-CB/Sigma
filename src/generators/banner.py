from pathlib import Path

from PIL import Image, ImageDraw

from config import Settings, BrandConfig
from src.generators.base import BaseGenerator
from src.utils.color import hex_to_rgb
from src.utils.text import draw_text_centered


class BannerGenerator(BaseGenerator):
    """Generate banner images for YouTube, LinkedIn, and Twitter."""

    def __init__(self, settings: Settings, brand: BrandConfig):
        super().__init__(settings, brand)

    def generate(
        self,
        title: str,
        platform: str = "youtube",
        output_path: str | None = None,
    ) -> Path:
        dim_key = f"{platform}_banner"
        width, height = self.settings.PLATFORM_DIMENSIONS.get(
            dim_key, (2560, 1440)
        )

        canvas = self._create_canvas(width, height)
        draw = ImageDraw.Draw(canvas)

        # Draw accent bar
        accent = hex_to_rgb(self.brand.colors["accent"])
        bar_height = height // 15
        draw.rectangle([(0, 0), (width, bar_height)], fill=accent)

        # Draw title
        draw_text_centered(
            draw,
            title,
            canvas.size,
            color=self.brand.colors["text_primary"],
            font_name=self.brand.typography["heading_font"],
        )

        # Draw tagline
        draw_text_centered(
            draw,
            self.brand.tagline,
            canvas.size,
            color=self.brand.colors["text_secondary"],
            font_name=self.brand.typography["body_font"],
            y_offset=60,
        )

        path = self._resolve_output_path(output_path, f"banner_{platform}")
        return self._save(canvas, path)
