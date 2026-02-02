# SIGMA - Smart Image & Graphics Marketing Asset Generator

A marketing asset generator for **Codebasics** that automates the creation of
thumbnails, banners, social media posts, and carousels across multiple platforms.

## Project Structure

```
Sigma/
├── config/             # App settings and brand configuration
├── src/                # Core source code
│   ├── generators/     # Asset generators (thumbnail, banner, social, carousel)
│   ├── templates/      # Base template engine
│   ├── utils/          # Image, text, and color utilities
│   └── exporters/      # Export to various formats and platforms
├── assets/             # Brand resources (fonts, logos, backgrounds, icons)
├── templates/          # Platform-specific templates (YouTube, Instagram, etc.)
├── output/             # Generated assets (git-ignored)
├── tests/              # Unit and integration tests
└── docs/               # Documentation
```

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Usage

```bash
python -m src.main
```

## Supported Platforms

- YouTube (thumbnails, banners)
- Instagram (posts, stories, carousels)
- LinkedIn (posts, banners)
- Twitter / X (posts, headers)
