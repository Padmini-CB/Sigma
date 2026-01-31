from setuptools import setup, find_packages

setup(
    name="sigma",
    version="0.1.0",
    description="Smart Image & Graphics Marketing Asset Generator for Codebasics",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[
        "Pillow>=10.0.0",
        "pyyaml>=6.0",
        "python-dotenv>=1.0.0",
        "Jinja2>=3.1.0",
        "requests>=2.31.0",
        "click>=8.1.0",
    ],
    entry_points={
        "console_scripts": [
            "sigma=src.main:cli",
        ],
    },
)
