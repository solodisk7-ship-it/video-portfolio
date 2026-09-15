# Pottery and Shoes video works

## Decision

Add two separate portfolio entries after the existing nine works. Keep all
eleven cards visible immediately without `Load More` and preserve the current
three-column desktop grid. The existing work order remains unchanged.

## Public content

### Pottery Workshop

- Title: `Pottery Workshop`
- Card metadata: `AI-Generated Film · Creative Direction & Editing`
- Ratio: `16:9`
- Order: `10`
- Lightbox disclosure:
  `Graphics, video, music and voice-over were created entirely with AI tools.
  Creative direction and final editing by the author.`

The AI disclosure appears only inside the lightbox. It uses the existing
typographic system and does not reserve empty space for works without a
description.

### Shoes — Square

- Title: `Shoes — Square`
- Card metadata: `Fashion Concept · Video Editing`
- Ratio: `1:1`
- Order: `11`
- No additional lightbox description

The technical year remains stored in content data but is not shown to users.

## Source and delivery mapping

| Public title | Source | Object key |
| --- | --- | --- |
| Pottery Workshop | `pottery production AI 1920x1080 29 s.mp4` | `videos/pottery-workshop-v01.mp4` |
| Shoes — Square | `shoes 1080-1080 30s.mp4` | `videos/shoes-square-v01.mp4` |

## Media preparation

Keep both source files unchanged. Create separate web copies using H.264,
yuv420p, AAC, faststart, explicit SDR Rec.709 tags and the established embedded
`Portfolio` watermark treatment. Use CRF-based encoding to reduce the current
bitrates while preserving motion detail and the original 1920×1080 and
1080×1080 resolutions.

Create one versioned WebP poster per work without the watermark. Card previews
use the shared `4:3` cover crop with a focal position. Lightbox playback keeps
the source ratios with `object-contain`.

## Content model and interface

Add an optional work description field. Render it in the lightbox only when it
has content, beneath the existing category and role metadata. Existing works
retain their current layout with no blank description area.

## Publishing flow

1. Prepare and verify both web copies and posters locally.
2. Upload only the prepared MP4 files to the existing `videos` folder in Yandex
   Object Storage.
3. Verify public MIME type, byte-range support and CORS.
4. Add both entries and release metadata to the site.
5. Run quality, build and browser checks, then publish through GitHub and
   Cloudflare Pages.

Do not publish the site references before both object-storage URLs pass the
checks.
