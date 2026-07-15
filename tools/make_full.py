"""Prepare a project image for the site: resize to web scale, no cropping.

Usage (from repo root):
    python tools/make_full.py path/to/source.png project-slug

Scales the image to fit within 1600x1600 (never enlarges, never crops)
and writes assets/projects/<slug>/full.png. The site shows a center-
cropped view of this file on the project card and the complete image
in the modal.  Requires Pillow:  pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image

MAX_DIM = 1600

def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src_path, slug = Path(sys.argv[1]), sys.argv[2]
    if not src_path.exists():
        sys.exit(f"No such file: {src_path}")

    img = Image.open(src_path).convert("RGB")
    img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)

    out_dir = Path("assets/projects") / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / "full.png"
    img.save(out, optimize=True)
    print(f"Wrote {out} ({img.size[0]}x{img.size[1]}, {out.stat().st_size // 1024} KB)")

if __name__ == "__main__":
    main()