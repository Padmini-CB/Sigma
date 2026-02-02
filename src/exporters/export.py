from pathlib import Path

from PIL import Image

from config import Settings


class Exporter:
    """Export generated assets to various formats and locations."""

    def __init__(self, settings: Settings):
        self.settings = settings

    def export(
        self,
        image: Image.Image,
        name: str,
        formats: list[str] | None = None,
    ) -> list[Path]:
        """Export an image to one or more formats.

        Args:
            image: The PIL Image to export.
            name: Base filename (without extension).
            formats: List of format strings (e.g. ['png', 'jpg', 'webp']).
                     Defaults to the configured output format.
        """
        if formats is None:
            formats = [self.settings.OUTPUT_FORMAT]

        saved = []
        for fmt in formats:
            if fmt not in self.settings.SUPPORTED_FORMATS:
                raise ValueError(
                    f"Unsupported format '{fmt}'. "
                    f"Supported: {self.settings.SUPPORTED_FORMATS}"
                )
            output_path = self.settings.OUTPUT_DIR / f"{name}.{fmt}"
            output_path.parent.mkdir(parents=True, exist_ok=True)

            save_kwargs = {"quality": self.settings.OUTPUT_QUALITY}
            if fmt == "png":
                save_kwargs.pop("quality")

            image.save(str(output_path), **save_kwargs)
            saved.append(output_path)

        return saved

    def export_batch(
        self,
        images: list[tuple[Image.Image, str]],
        formats: list[str] | None = None,
    ) -> list[Path]:
        """Export multiple images.

        Args:
            images: List of (image, name) tuples.
            formats: Export formats to use.
        """
        all_saved = []
        for image, name in images:
            all_saved.extend(self.export(image, name, formats))
        return all_saved
