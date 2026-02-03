from pathlib import Path

from PIL import Image, ImageDraw

from config import Settings, BrandConfig
from src.generators.base import BaseGenerator
from src.utils.color import hex_to_rgb
from src.utils.text import draw_text_centered


class CarouselGenerator(BaseGenerator):
    """Generate multi-slide carousel images for Instagram and LinkedIn."""

    def __init__(self, settings: Settings, brand: BrandConfig):
        super().__init__(settings, brand)

    def generate(
        self,
        title: str,
        num_slides: int = 5,
        platform: str = "instagram",
        output_path: str | None = None,
    ) -> list[Path]:
        dim_key = f"{platform}_carousel"
        width, height = self.settings.PLATFORM_DIMENSIONS.get(
            dim_key, (1080, 1080)
        )

        output_dir = Path(output_path) if output_path else self.settings.OUTPUT_DIR / "carousel"
        output_dir.mkdir(parents=True, exist_ok=True)

        saved_paths = []
        for i in range(num_slides):
            canvas = self._create_canvas(width, height)
            draw = ImageDraw.Draw(canvas)

            # Alternate accent color per slide
            primary = hex_to_rgb(self.brand.colors["primary"])
            accent = hex_to_rgb(self.brand.colors["accent"])
            bar_color = primary if i % 2 == 0 else accent

            # Top accent bar
            draw.rectangle([(0, 0), (width, 8)], fill=bar_color)

            # Slide number indicator
            draw_text_centered(
                draw,
                f"{i + 1}/{num_slides}",
                canvas.size,
                color=self.brand.colors["text_secondary"],
                font_name=self.brand.typography["accent_font"],
                y_offset=-(height // 3),
            )

            # Slide title
            slide_title = title if i == 0 else f"{title} - Part {i + 1}"
            draw_text_centered(
                draw,
                slide_title,
                canvas.size,
                color=self.brand.colors["text_primary"],
                font_name=self.brand.typography["heading_font"],
            )

            slide_path = output_dir / f"slide_{i + 1:02d}.{self.settings.OUTPUT_FORMAT}"
            self._save(canvas, slide_path)
            saved_paths.append(slide_path)

        return saved_paths
