# Sport video series

## Decision

Publish all six Sport videos as separate portfolio entries. Together with the
three Boots entries, the homepage shows nine cards immediately in a balanced
three-by-three desktop grid without `Load More`.

## Public titles and metadata

All Sport entries use `Sports Concept · Video Editing` and do not display a
year. Public titles avoid league names so the training work cannot be mistaken
for an official league commission.

1. `Sport — Main Film`
2. `Sport — Hockey`
3. `Sport — American Football`
4. `Sport — Soccer`
5. `Sport — Baseball`
6. `Sport — Basketball`

## Source and delivery mapping

| Public title | Ratio | Source | Object key |
| --- | --- | --- | --- |
| Sport — Main Film | 16:9 | `Sport 1920x1080 30s.mp4` | `videos/sport-main-film-v01.mp4` |
| Sport — Hockey | 1:1 | `Sport 900x900 10s NHL.mp4` | `videos/sport-hockey-v01.mp4` |
| Sport — American Football | 1:1 | `Sport 900x900 10s NFL.mp4` | `videos/sport-american-football-v01.mp4` |
| Sport — Soccer | 1:1 | `Sport 900x900 10s MLS.mp4` | `videos/sport-soccer-v01.mp4` |
| Sport — Baseball | 1:1 | `Sport 900x900 10s MLB.mp4` | `videos/sport-baseball-v01.mp4` |
| Sport — Basketball | 1:1 | `Sport 900x900 10s NBA.mp4` | `videos/sport-basketball-v01.mp4` |

## Media preparation

Keep the source files unchanged. Create separate web copies using H.264,
yuv420p, AAC, faststart, explicit SDR Rec.709 tags and the existing embedded
`Portfolio` watermark treatment. Use CRF-based encoding to reduce the current
oversized square-video bitrates while retaining detail in fast movement.

Create one versioned WebP poster per entry. Card posters use the approved `4:3`
crop with an optional focal position; lightbox playback keeps the original
video ratio with `object-contain`.

## Publishing flow

1. Prepare and verify the six web copies and posters locally.
2. Upload only the prepared MP4 files to the existing `videos` folder in Yandex
   Object Storage.
3. Verify public MIME type, byte-range support and CORS.
4. Add the six entries and release metadata to the site.
5. Run quality, build and browser tests, then publish through GitHub and
   Cloudflare Pages.

Do not publish site references before all six object-storage URLs pass the
checks, so no broken cards reach the public site.

