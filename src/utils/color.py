def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert a hex color string like '#1a73e8' to an (R, G, B) tuple."""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(r: int, g: int, b: int) -> str:
    """Convert RGB values to a hex color string."""
    return f"#{r:02x}{g:02x}{b:02x}"


def adjust_brightness(
    hex_color: str, factor: float
) -> tuple[int, int, int]:
    """Adjust brightness of a hex color. factor > 1 brightens, < 1 darkens."""
    r, g, b = hex_to_rgb(hex_color)
    return (
        min(255, int(r * factor)),
        min(255, int(g * factor)),
        min(255, int(b * factor)),
    )


def blend_colors(
    color1: str, color2: str, ratio: float = 0.5
) -> tuple[int, int, int]:
    """Blend two hex colors together. ratio=0 is all color1, ratio=1 is all color2."""
    r1, g1, b1 = hex_to_rgb(color1)
    r2, g2, b2 = hex_to_rgb(color2)
    return (
        int(r1 + (r2 - r1) * ratio),
        int(g1 + (g2 - g1) * ratio),
        int(b1 + (b2 - b1) * ratio),
    )
