from pathlib import Path
import yaml


class BrandConfig:
    """Load and provide access to brand configuration from brand.yaml."""

    def __init__(self, config_path: str | None = None):
        if config_path is None:
            config_path = Path(__file__).parent / "brand.yaml"
        with open(config_path, "r") as f:
            self._config = yaml.safe_load(f)

    @property
    def name(self) -> str:
        return self._config["brand"]["name"]

    @property
    def tagline(self) -> str:
        return self._config["brand"]["tagline"]

    @property
    def colors(self) -> dict:
        return self._config["colors"]

    @property
    def typography(self) -> dict:
        return self._config["typography"]

    @property
    def logo_paths(self) -> dict:
        return self._config["logo"]

    @property
    def defaults(self) -> dict:
        return self._config["defaults"]
