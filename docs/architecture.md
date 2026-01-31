# SIGMA Architecture

## Overview

SIGMA (Smart Image & Graphics Marketing Asset Generator) is a CLI tool that
generates marketing assets for the Codebasics brand across multiple platforms.

## Components

### Generators (`src/generators/`)
Each generator extends `BaseGenerator` and implements the `generate()` method:
- **ThumbnailGenerator** - YouTube thumbnails, course preview images
- **BannerGenerator** - Platform banners (YouTube, LinkedIn, Twitter)
- **SocialPostGenerator** - Square/rectangular social media posts
- **CarouselGenerator** - Multi-slide carousels for Instagram/LinkedIn

### Template Engine (`src/templates/`)
Jinja2-based system for loading platform-specific layout templates from
the `templates/` directory.

### Utilities (`src/utils/`)
- **image.py** - Image loading, resizing (cover/contain), overlay compositing
- **text.py** - Centered and wrapped text rendering with font management
- **color.py** - Hex/RGB conversion, brightness adjustment, color blending

### Exporters (`src/exporters/`)
Handles saving generated assets in multiple formats (PNG, JPG, WebP, PDF)
with configurable quality settings.

### Configuration (`config/`)
- **settings.py** - App settings from environment variables, platform dimensions
- **brand.yaml** - Codebasics brand identity (colors, fonts, logos, defaults)
- **brand.py** - Python interface to the brand YAML config

## Data Flow

```
CLI Command
    -> Generator (creates canvas, applies brand styling)
        -> Utils (text rendering, image manipulation, colors)
        -> Exporter (saves to configured formats)
            -> output/
```
