from pathlib import Path

from PIL import Image


def load_image(path: str | Path) -> Image.Image:
    """Load an image from disk."""
    return Image.open(str(path)).convert("RGBA")


def resize_image(
    image: Image.Image,
    width: int,
    height: int,
    method: str = "cover",
) -> Image.Image:
    """Resize an image using the specified method.

    Args:
        image: Source PIL Image.
        width: Target width.
        height: Target height.
        method: 'cover' crops to fill, 'contain' fits within bounds.
    """
    if method == "cover":
        ratio = max(width / image.width, height / image.height)
        resized = image.resize(
            (int(image.width * ratio), int(image.height * ratio)),
            Image.LANCZOS,
        )
        left = (resized.width - width) // 2
        top = (resized.height - height) // 2
        return resized.crop((left, top, left + width, top + height))

    # contain
    ratio = min(width / image.width, height / image.height)
    return image.resize(
        (int(image.width * ratio), int(image.height * ratio)),
        Image.LANCZOS,
    )


def apply_overlay(
    base: Image.Image,
    overlay: Image.Image,
    position: tuple[int, int] = (0, 0),
    opacity: float = 1.0,
) -> Image.Image:
    """Composite an overlay image onto a base image with optional opacity."""
    if opacity < 1.0:
        overlay = overlay.copy()
        alpha = overlay.getchannel("A")
        alpha = alpha.point(lambda p: int(p * opacity))
        overlay.putalpha(alpha)
    result = base.copy()
    result.paste(overlay, position, overlay)
    return result
