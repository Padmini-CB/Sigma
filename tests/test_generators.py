from pathlib import Path
from unittest.mock import patch

import pytest

from config import Settings, BrandConfig
from src.generators.thumbnail import ThumbnailGenerator
from src.generators.banner import BannerGenerator


@pytest.fixture
def settings():
    return Settings()


@pytest.fixture
def brand():
    return BrandConfig()


class TestThumbnailGenerator:
    def test_generate_creates_file(self, settings, brand, tmp_path):
        gen = ThumbnailGenerator(settings, brand)
        output = tmp_path / "test_thumb.png"
        result = gen.generate(title="Test Thumbnail", output_path=str(output))
        assert result.exists()
        assert result.suffix == ".png"

    def test_generate_default_dimensions(self, settings, brand, tmp_path):
        gen = ThumbnailGenerator(settings, brand)
        output = tmp_path / "thumb.png"
        gen.generate(title="Test", output_path=str(output))
        from PIL import Image

        img = Image.open(output)
        assert img.size == (1280, 720)


class TestBannerGenerator:
    def test_generate_creates_file(self, settings, brand, tmp_path):
        gen = BannerGenerator(settings, brand)
        output = tmp_path / "test_banner.png"
        result = gen.generate(title="Test Banner", output_path=str(output))
        assert result.exists()
        assert result.suffix == ".png"
