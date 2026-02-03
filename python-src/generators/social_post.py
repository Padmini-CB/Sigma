from pathlib import Path

from PIL import Image, ImageDraw

from config import Settings, BrandConfig
from src.generators.base import BaseGenerator
from src.utils.color import hex_to_rgb
from src.utils.text import draw_text_wrapped


class SocialPostGenerator(BaseGenerator):
    """Generate social media post images for Instagram, LinkedIn, and Twitter."""

    def __init__(self, settings: Settings, brand: BrandConfig):
        super().__init__(settings, brand)

    def generate(
        self,
        text: str,
        platform: str = "instagram",
        output_path: str | None = None,
    ) -> Path:
        dim_key = f"{platform}_post"
        width, height = self.settings.PLATFORM_DIMENSIONS.get(
            dim_key, (1080, 1080)
        )

        canvas = self._create_canvas(width, height)
        draw = ImageDraw.Draw(canvas)

        # Draw border frame
        primary = hex_to_rgb(self.brand.colors["primary"])
        border = self.brand.defaults["padding"] // 2
        draw.rectangle(
            [(border, border), (width - border, height - border)],
            outline=primary,
            width=4,
        )

        # Draw post text
        padding = self.brand.defaults["padding"]
        draw_text_wrapped(
            draw,
            text,
            max_width=width - padding * 2,
            position=(padding, height // 3),
            color=self.brand.colors["text_primary"],
            font_name=self.brand.typography["body_font"],
        )

        # Draw brand name at bottom
        draw_text_wrapped(
            draw,
            self.brand.name,
            max_width=width,
            position=(padding, height - padding * 2),
            color=self.brand.colors["text_secondary"],
            font_name=self.brand.typography["accent_font"],
        )

        path = self._resolve_output_path(output_path, f"post_{platform}")
        return self._save(canvas, path)
