from pathlib import Path
from jinja2 import Environment, FileSystemLoader

from config import Settings


class TemplateEngine:
    """Jinja2-based template engine for loading platform-specific templates."""

    def __init__(self, settings: Settings):
        self.templates_dir = settings.TEMPLATES_DIR
        self.env = Environment(
            loader=FileSystemLoader(str(self.templates_dir)),
            autoescape=False,
        )

    def list_templates(self, platform: str | None = None) -> list[str]:
        """List available templates, optionally filtered by platform."""
        all_templates = self.env.list_templates()
        if platform:
            return [t for t in all_templates if t.startswith(f"{platform}/")]
        return all_templates

    def render(self, template_name: str, **context) -> str:
        """Render a template with the given context variables."""
        template = self.env.get_template(template_name)
        return template.render(**context)

    def get_template_path(self, platform: str, name: str) -> Path:
        """Get the full filesystem path for a template."""
        return self.templates_dir / platform / name
