# Font files

Self-hosted fonts, loaded with the Astro Fonts API local provider ([decision 0009](../../../docs/decisions/0009-self-hosted-font-files.md)). Each weight is split into a Latin and a Latin Extended subset with matching `unicode-range` in `astro.config.mjs`, so browsers download only what a page uses.

| Family     | Weights       | Source                         | Licence (shipped with the site)                                                               |
| ---------- | ------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| Rubik      | 900           | `@fontsource/rubik` 5.3.0      | [`public/fonts/licenses/Rubik-OFL.txt`](../../../public/fonts/licenses/Rubik-OFL.txt)         |
| Sora       | 400, 600, 700 | `@fontsource/sora` 5.3.0       | [`public/fonts/licenses/Sora-OFL.txt`](../../../public/fonts/licenses/Sora-OFL.txt)           |
| Space Mono | 400, 700      | `@fontsource/space-mono` 5.3.0 | [`public/fonts/licenses/SpaceMono-OFL.txt`](../../../public/fonts/licenses/SpaceMono-OFL.txt) |

All three are under the SIL Open Font License 1.1 ([LEG-008](../../../docs/SPEC.md#legal-requirements)). The files are unmodified copies of the packages' `files/*-latin-*` and `files/*-latin-ext-*` `woff2` files.

To update: `npm pack @fontsource/<family>` in a scratch directory, copy the same file names, update the version above and the licence if it changed.
