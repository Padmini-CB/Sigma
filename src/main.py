import click
from config import Settings, BrandConfig


@click.group()
@click.pass_context
def cli(ctx):
    """SIGMA - Marketing Asset Generator for Codebasics."""
    ctx.ensure_object(dict)
    ctx.obj["settings"] = Settings()
    ctx.obj["brand"] = BrandConfig()


@cli.command()
@click.option("--title", required=True, help="Title text for the thumbnail")
@click.option("--platform", default="youtube", help="Target platform")
@click.option("--output", default=None, help="Output file path")
@click.pass_context
def thumbnail(ctx, title, platform, output):
    """Generate a thumbnail image."""
    from src.generators.thumbnail import ThumbnailGenerator

    generator = ThumbnailGenerator(ctx.obj["settings"], ctx.obj["brand"])
    result = generator.generate(title=title, platform=platform, output_path=output)
    click.echo(f"Thumbnail saved to: {result}")


@cli.command()
@click.option("--title", required=True, help="Title text for the banner")
@click.option("--platform", default="youtube", help="Target platform")
@click.option("--output", default=None, help="Output file path")
@click.pass_context
def banner(ctx, title, platform, output):
    """Generate a banner image."""
    from src.generators.banner import BannerGenerator

    generator = BannerGenerator(ctx.obj["settings"], ctx.obj["brand"])
    result = generator.generate(title=title, platform=platform, output_path=output)
    click.echo(f"Banner saved to: {result}")


@cli.command()
@click.option("--text", required=True, help="Post text content")
@click.option("--platform", default="instagram", help="Target platform")
@click.option("--output", default=None, help="Output file path")
@click.pass_context
def social(ctx, text, platform, output):
    """Generate a social media post image."""
    from src.generators.social_post import SocialPostGenerator

    generator = SocialPostGenerator(ctx.obj["settings"], ctx.obj["brand"])
    result = generator.generate(text=text, platform=platform, output_path=output)
    click.echo(f"Social post saved to: {result}")


@cli.command()
@click.option("--slides", required=True, type=int, help="Number of carousel slides")
@click.option("--title", required=True, help="Carousel title")
@click.option("--platform", default="instagram", help="Target platform")
@click.option("--output", default=None, help="Output directory path")
@click.pass_context
def carousel(ctx, slides, title, platform, output):
    """Generate a carousel of images."""
    from src.generators.carousel import CarouselGenerator

    generator = CarouselGenerator(ctx.obj["settings"], ctx.obj["brand"])
    results = generator.generate(
        title=title, num_slides=slides, platform=platform, output_path=output
    )
    click.echo(f"Carousel ({len(results)} slides) saved to: {results[0].parent}")


if __name__ == "__main__":
    cli()
