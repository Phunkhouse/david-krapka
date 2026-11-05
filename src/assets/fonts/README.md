# Font files

Self-hosted fonts, loaded with the Astro Fonts API local provider ([decision 0009](../../../docs/decisions/0009-self-hosted-font-files.md)). Each file holds one weight with only the characters the site can show: printable ASCII, the Czech alphabet, typographic punctuation and any other non-ASCII character used in `src/` ([decision 0010](../../../docs/decisions/0010-subset-fonts-to-site-characters.md)). Total per page: about 57 KB.

| Family     | Weights       | Files                                   | Source (unmodified originals)  | Licence (shipped with the site)                                                               |
| ---------- | ------------- | --------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| Rubik      | 900           | `rubik-site-900-normal.woff2`           | `@fontsource/rubik` 5.3.0      | [`public/fonts/licenses/Rubik-OFL.txt`](../../../public/fonts/licenses/Rubik-OFL.txt)         |
| Sora       | 400, 600, 700 | `sora-site-<weight>-normal.woff2`       | `@fontsource/sora` 5.3.0       | [`public/fonts/licenses/Sora-OFL.txt`](../../../public/fonts/licenses/Sora-OFL.txt)           |
| Space Mono | 400, 700      | `space-mono-site-<weight>-normal.woff2` | `@fontsource/space-mono` 5.3.0 | [`public/fonts/licenses/SpaceMono-OFL.txt`](../../../public/fonts/licenses/SpaceMono-OFL.txt) |

All three are under the SIL Open Font License 1.1 ([LEG-008](../../../docs/SPEC.md#legal-requirements)), which allows these modified (subset) files. None declares a Reserved Font Name.

## Regenerating

Do this when new copy needs a character that is not in the files yet (the browser then shows it in a fallback font), or when updating a font version. The script rebuilds the character set from `src/`, merges each weight's Fontsource Latin and Latin Extended files and writes the `*-site-*` files. It reports characters a font does not contain (these fonts have no arrows `←` `→`, and `↑` `↓` only in Space Mono, so arrows already come from a fallback font).

```bash
# 1. The original Fontsource files (Latin and Latin Extended; the packages hold all weights)
mkdir -p /tmp/fontsource && cd /tmp/fontsource
for f in rubik sora space-mono; do
  npm pack @fontsource/$f@5.3.0
  tar -xzf fontsource-$f-5.3.0.tgz --strip-components=2 \
    "package/files/$f-latin-*-normal.woff2" "package/files/$f-latin-ext-*-normal.woff2"
done

# 2. A throwaway Python environment
python3 -m venv /tmp/fonts-venv
/tmp/fonts-venv/bin/pip install fonttools==4.58.0 brotli==1.1.0

# 3. From the repository root
/tmp/fonts-venv/bin/python scripts/subset-fonts.py /tmp/fontsource src/assets/fonts
pnpm build   # then check the per-page font payload
```

Tested on 5 November 2026 with these exact commands. The output is not byte-identical from run to run (the font header carries a timestamp) but has the same content and size within a few bytes.
