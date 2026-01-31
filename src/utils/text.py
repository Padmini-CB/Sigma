from PIL import ImageDraw, ImageFont

from src.utils.color import hex_to_rgb

# Default font size when custom fonts aren't available
DEFAULT_FONT_SIZE = 48
SMALL_FONT_SIZE = 24


def _load_font(font_name: str | None, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    """Try to load a named font, fall back to default."""
    if font_name:
        try:
            return ImageFont.truetype(font_name, size)
        except OSError:
            pass
    try:
        return ImageFont.truetype("DejaVuSans.ttf", size)
    except OSError:
        return ImageFont.load_default()


def draw_text_centered(
    draw: ImageDraw.ImageDraw,
    text: str,
    canvas_size: tuple[int, int],
    color: str = "#ffffff",
    font_name: str | None = None,
    font_size: int = DEFAULT_FONT_SIZE,
    y_offset: int = 0,
) -> None:
    """Draw text centered on the canvas."""
    font = _load_font(font_name, font_size)
    rgb = hex_to_rgb(color)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (canvas_size[0] - text_width) // 2
    y = (canvas_size[1] - text_height) // 2 + y_offset
    draw.text((x, y), text, fill=rgb, font=font)


def draw_text_wrapped(
    draw: ImageDraw.ImageDraw,
    text: str,
    max_width: int,
    position: tuple[int, int] = (0, 0),
    color: str = "#ffffff",
    font_name: str | None = None,
    font_size: int = SMALL_FONT_SIZE,
    line_spacing: int = 8,
) -> None:
    """Draw text with word wrapping within the given max width."""
    font = _load_font(font_name, font_size)
    rgb = hex_to_rgb(color)
    words = text.split()
    lines: list[str] = []
    current_line = ""

    for word in words:
        test_line = f"{current_line} {word}".strip()
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)

    x, y = position
    for line in lines:
        draw.text((x, y), line, fill=rgb, font=font)
        bbox = draw.textbbox((0, 0), line, font=font)
        y += (bbox[3] - bbox[1]) + line_spacing
