"""Convert source PNG posters to display-ready WebP files.

Run from the project root:
    python scripts/optimize-posters.py
"""

from pathlib import Path
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
WORKS = ROOT / "public" / "works"
TARGET_BYTES = 250 * 1024
MAX_BYTES = 400 * 1024
MAX_EDGE = 1600


def convert(source: Path) -> None:
    destination = source.with_suffix(".webp")
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        if max(image.size) > MAX_EDGE:
            resampling = getattr(Image, "Resampling", Image)
            image.thumbnail((MAX_EDGE, MAX_EDGE), resampling.LANCZOS)

        for quality in range(84, 54, -4):
            image.save(destination, "WEBP", quality=quality, method=6)
            if destination.stat().st_size <= TARGET_BYTES:
                break

    size = destination.stat().st_size
    if size > MAX_BYTES:
        raise RuntimeError(f"{destination.name} is still over 400 KB ({size} bytes)")
    print(f"{source.name} -> {destination.name}: {size // 1024} KB")


def main() -> None:
    sources = sorted(WORKS.glob("*.png"))
    if not sources:
        raise RuntimeError(f"No PNG posters found in {WORKS}")
    for source in sources:
        convert(source)


if __name__ == "__main__":
    main()
