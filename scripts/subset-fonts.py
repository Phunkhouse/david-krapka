#!/usr/bin/env python3
"""Build the site's font files: one small woff2 per family and weight with only
the characters the site can show (decision 0009, docs/decisions/0010).

Input: the unmodified Fontsource files (`<family>-latin-<weight>-normal.woff2`
and `<family>-latin-ext-<weight>-normal.woff2`, see src/assets/fonts/README.md).
Output: `<family>-site-<weight>-normal.woff2` and `charset.json` (the character
set, checked against the built pages by scripts/check-fonts.mjs) in the output directory.

Usage (needs fonttools and brotli, for example in a throwaway venv):

    python3 -m venv /tmp/fonts-venv
    /tmp/fonts-venv/bin/pip install fonttools==4.58.0 brotli==1.1.0
    /tmp/fonts-venv/bin/python scripts/subset-fonts.py <fontsource-dir> src/assets/fonts

The character set is: printable ASCII, every non-ASCII character that appears
in src/ (copy, components, pages), and the extras below. A character the font
does not contain is reported and left out. When new copy needs a character
that is not in the set, run this again: the set is rebuilt from src/.
"""

import json
import sys
import tempfile
from pathlib import Path

from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont

FAMILIES = {
    'rubik': [900],
    'sora': [400, 600, 700],
    'space-mono': [400, 700],
}

# Always included, even if not in the copy yet: the full Czech alphabet,
# typographic punctuation and the arrows and symbols the design uses.
NBSP = '\u00a0'
CZECH = 'ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž'
EXTRAS = CZECH + NBSP + '·–—‘’“”„…•©®×€→↑←↓↗'


def site_characters(src_dir: Path) -> set[str]:
    chars = {chr(c) for c in range(0x20, 0x7F)} | set(EXTRAS)
    for path in src_dir.rglob('*'):
        if path.suffix in {'.ts', '.astro', '.css', '.md', '.mdx'}:
            chars |= {c for c in path.read_text(encoding='utf8') if ord(c) > 0x7F}
    # Headings are set in uppercase with CSS, so include both cases of every
    # letter (the browser renders "é" as "É" under text-transform).
    chars |= {v for c in chars for v in (c.upper(), c.lower()) if len(v) == 1}
    # Drop anything that is not a printable character.
    return {c for c in chars if c.isprintable() or c == NBSP}


def subset_font(path: Path, unicodes: list[int]) -> TTFont:
    options = subset.Options()
    options.flavor = None
    options.layout_features = ['*']
    options.notdef_outline = True
    options.name_IDs = ['*']
    options.hinting = False
    font = subset.load_font(str(path), options)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    return font


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    source, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    chars = site_characters(Path('src'))
    unicodes = sorted(ord(c) for c in chars)
    print(f'{len(unicodes)} characters; non-ASCII: {"".join(sorted(c for c in chars if ord(c) > 0x7F))}')

    total = 0
    for family, weights in FAMILIES.items():
        for weight in weights:
            # Both subsets come from the same font; merge them into one file.
            with tempfile.TemporaryDirectory() as tmp:
                parts = []
                for subset_name in ('latin', 'latin-ext'):
                    file = source / f'{family}-{subset_name}-{weight}-normal.woff2'
                    part = Path(tmp) / f'{subset_name}.ttf'
                    subset_font(file, unicodes).save(part)
                    parts.append(str(part))
                merged = Merger().merge(parts)
            cmap = set(merged.getBestCmap())
            missing = sorted(c for c in chars if ord(c) not in cmap)
            target = out / f'{family}-site-{weight}-normal.woff2'
            merged.flavor = 'woff2'
            merged.save(target)
            size = target.stat().st_size
            total += size
            note = f'  missing: {"".join(missing)}' if missing else ''
            print(f'{target.name}: {size} bytes{note}')
    print(f'total {total} bytes')

    # The manifest scripts/check-fonts.mjs compares the built pages against.
    manifest = {
        'note': 'Written by scripts/subset-fonts.py. Characters the site fonts are built for.',
        'characters': ''.join(sorted(chars, key=ord)),
    }
    (out / 'charset.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf8'
    )
    return 0


if __name__ == '__main__':
    sys.exit(main())
