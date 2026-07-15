"""Make the curated 16:9 preview for a project card/modal header.

Usage (from repo root):
    python tools/make_preview.py path/to/source.png project-slug [fx fy] [zoom]

fx, fy: focal point of the crop as fractions of width/height (default 0.5 0.5,
        the center). E.g. 0.3 0.7 targets left-of-center, lower part.
zoom:   how tight the crop is (default 1.0 = widest possible 16:9 window;
        2.0 = a window half that size, i.e. 2x zoomed in on the focal point).

Writes assets/projects/<slug>/preview.png (1200x675).
Requires Pillow:  pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image

W, H = 1200, 675  # 16:9

def main():
    args = sys.argv[1:]
    if len(args) not in (2, 4, 5):
        sys.exit(__doc__)
    src_path, slug = Path(args[0]), args[1]
    fx, fy = (float(args[2]), float(args[3])) if len(args) >= 4 else (0.5, 0.5)
    zoom = float(args[4]) if len(args) == 5 else 1.0
    if not src_path.exists():
        sys.exit(f"No such file: {src_path}")
    if zoom < 1.0:
        sys.exit("zoom must be >= 1.0")

    img = Image.open(src_path).convert("RGB")
    w, h = img.size

    # widest 16:9 window that fits, then shrink by zoom
    target_ratio = W / H
    if w / h > target_ratio:
        cw, ch = h * target_ratio, h
    else:
        cw, ch = w, w / target_ratio
    cw, ch = cw / zoom, ch / zoom

    # center the window on the focal point, clamped inside the image
    cx = min(max(fx * w, cw / 2), w - cw / 2)
    cy = min(max(fy * h, ch / 2), h - ch / 2)
    box = (int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))

    img = img.crop(box).resize((W, H), Image.LANCZOS)
    out_dir = Path("assets/projects") / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / "preview.png"
    img.save(out, optimize=True)
    print(f"Wrote {out} (crop {box} from {w}x{h})")

if __name__ == "__main__":
    main()