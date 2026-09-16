# Format titles and Shoes poster

## Decision

Clarify the public format of the Pottery and Sport works while preserving the
existing catalogue order, metadata and media files. Replace the Shoes card
poster with the final shot of the woman from the source video.

## Public titles

- `Pottery Workshop — Horizontal`
- `Sport (Main Film) — Horizontal`
- `Sport (Hockey) — Square`
- `Sport (American Football) — Square`
- `Sport (Soccer) — Square`
- `Sport (Baseball) — Square`
- `Sport (Basketball) — Square`

The parentheses identify the individual film within the Sport series. The em
dash separates the project name from its delivery format and remains
consistent with the Boots, Shoes and Pottery titles.

## Shoes poster

Use the final shot near `00:29` in the original Shoes source, where the woman
is seated against the burgundy background. Extract the poster from the clean
source rather than from the watermarked web copy.

Publish the poster as `shoes-square-v02.webp` and update the catalogue path so
browser and CDN caches cannot retain the previous shoe close-up. Keep the
existing 4:3 card crop, square lightbox format, video object and card metadata.

## Scope and verification

Do not change work order, descriptions, categories, roles, year visibility or
video files. Update title assertions where needed, run quality and production
build checks, inspect desktop and mobile layouts, and verify the published
site after Cloudflare Pages completes.
