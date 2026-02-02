from src.utils.color import hex_to_rgb, rgb_to_hex, adjust_brightness, blend_colors


class TestHexToRgb:
    def test_basic_conversion(self):
        assert hex_to_rgb("#ff0000") == (255, 0, 0)
        assert hex_to_rgb("#00ff00") == (0, 255, 0)
        assert hex_to_rgb("#0000ff") == (0, 0, 255)

    def test_without_hash(self):
        assert hex_to_rgb("1a73e8") == (26, 115, 232)

    def test_white_and_black(self):
        assert hex_to_rgb("#ffffff") == (255, 255, 255)
        assert hex_to_rgb("#000000") == (0, 0, 0)


class TestRgbToHex:
    def test_basic_conversion(self):
        assert rgb_to_hex(255, 0, 0) == "#ff0000"
        assert rgb_to_hex(0, 255, 0) == "#00ff00"

    def test_roundtrip(self):
        original = "#1a73e8"
        r, g, b = hex_to_rgb(original)
        assert rgb_to_hex(r, g, b) == original


class TestAdjustBrightness:
    def test_darken(self):
        result = adjust_brightness("#ffffff", 0.5)
        assert result == (127, 127, 127)

    def test_brighten_clamped(self):
        result = adjust_brightness("#cccccc", 2.0)
        assert result == (255, 255, 255)


class TestBlendColors:
    def test_equal_blend(self):
        result = blend_colors("#000000", "#ffffff", 0.5)
        assert result == (127, 127, 127)

    def test_full_first_color(self):
        result = blend_colors("#ff0000", "#0000ff", 0.0)
        assert result == (255, 0, 0)

    def test_full_second_color(self):
        result = blend_colors("#ff0000", "#0000ff", 1.0)
        assert result == (0, 0, 255)
