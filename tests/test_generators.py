from pathlib import Path
from unittest.mock import patch

import pytest

from config import Settings, BrandConfig
from src.generators.thumbnail import ThumbnailGenerator
from src.generators.banner import BannerGenerator
from src.generators.social_post import SocialPostGenerator
from src.generators.carousel import CarouselGenerator


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


class TestSocialPostGenerator:
    def test_generate_creates_file(self, settings, brand, tmp_path):
        gen = SocialPostGenerator(settings, brand)
        output = tmp_path / "test_post.png"
        result = gen.generate(text="Test post content", output_path=str(output))
        assert result.exists()
        assert result.suffix == ".png"

    def test_generate_default_dimensions(self, settings, brand, tmp_path):
        gen = SocialPostGenerator(settings, brand)
        output = tmp_path / "post.png"
        gen.generate(text="Test", output_path=str(output))
        from PIL import Image

        img = Image.open(output)
        assert img.size == (1080, 1080)

    def test_generate_different_platforms(self, settings, brand, tmp_path):
        gen = SocialPostGenerator(settings, brand)
        for platform in ["instagram", "linkedin", "twitter"]:
            output = tmp_path / f"post_{platform}.png"
            result = gen.generate(
                text="Platform test", platform=platform, output_path=str(output)
            )
            assert result.exists()


class TestCarouselGenerator:
    def test_generate_creates_files(self, settings, brand, tmp_path):
        gen = CarouselGenerator(settings, brand)
        output_dir = tmp_path / "carousel"
        results = gen.generate(
            title="Test Carousel", num_slides=3, output_path=str(output_dir)
        )
        assert len(results) == 3
        for path in results:
            assert path.exists()
            assert path.suffix == ".png"

    def test_generate_default_slide_count(self, settings, brand, tmp_path):
        gen = CarouselGenerator(settings, brand)
        output_dir = tmp_path / "carousel_default"
        results = gen.generate(title="Default Slides", output_path=str(output_dir))
        assert len(results) == 5

    def test_generate_slide_dimensions(self, settings, brand, tmp_path):
        gen = CarouselGenerator(settings, brand)
        output_dir = tmp_path / "carousel_dims"
        results = gen.generate(
            title="Dimension Test", num_slides=1, output_path=str(output_dir)
        )
        from PIL import Image

        img = Image.open(results[0])
        assert img.size == (1080, 1080)
