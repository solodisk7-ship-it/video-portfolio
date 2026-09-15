# Boots video variants

## Status

Approved on 2026-09-15.

## Goal

Add the first three final portfolio videos as related adaptations of one
self-directed fashion concept. Preserve the approved gallery and lightbox
design while making every format directly accessible.

## Content decision

Represent the adaptations as three separate works. This matches the existing
`Work` contract, where one work owns one poster, one aspect ratio and one
versioned video key. Do not add a carousel, format selector or automatic
device-based source switching.

Use these public titles in this order:

1. `Boots — Landscape`
2. `Boots — Square`
3. `Boots — Vertical`

Use the same metadata for all three entries:

- category: `Fashion Concept`
- role: `Video Editing`
- year: `2026` (catalogue data only; not displayed in the current UI)

The wording intentionally presents the work professionally without implying a
commercial client campaign.

Hide the year from both the card metadata line and the lightbox metadata line
while the public catalogue is small. Keep the value in the typed catalogue so
it can be restored later without reconstructing historical data.

## Media mapping

| Work | Ratio | Duration | Source file | Versioned object key |
| --- | --- | ---: | --- | --- |
| Boots — Landscape | 16:9 | 30 s | `Katerina Yakunina Boots 1920x1080 30s RC4.mp4` | `videos/boots-landscape-v01.mp4` |
| Boots — Square | 1:1 | 15 s | `Katerina Yakunina Boots 720x720 15s RC2.mp4` | `videos/boots-square-v01.mp4` |
| Boots — Vertical | 9:16 | 10 s | `Katerina Yakunina Boots 900x1600 10s RC2.mp4` | `videos/boots-vertical-v01.mp4` |

Preserve the local source files. Prepare release copies with safe versioned
names, explicit Rec.709 colour tags and the agreed embedded watermark. Keep
H.264 video, yuv420p, AAC audio and faststart. Upload only the release copies to
Yandex Object Storage.

Create a distinct WebP poster for each work. Posters remain local under
`public/works`, use a representative frame, preserve the source aspect ratio,
and stay below the existing 400 KB hard limit.

## Catalogue staging

The portfolio is still being assembled. Hide the inherited placeholder works
instead of deleting them, and show the three Boots entries as the current
Featured set. Keep the content status non-production until the rest of the
portfolio content and site identity are ready.

The demo video override must not replace these real video URLs. Resolve the
three versioned keys against the existing Yandex Object Storage base URL.

Allow one to six visible Featured works during the demo/staging phase. Retain
the six-work requirement for a completed catalogue. Before production launch,
align the production catalogue minimum with the approved 10–20 work launch
target rather than the current 30-work minimum.

## Interaction and performance

Do not change the approved two-column desktop grid, one-column mobile grid,
white lightbox, native video controls or restrained motion. The only metadata
display change is removing the year from cards and the lightbox. Cards display
only their local posters. The selected MP4 is mounted only after its card opens
with `preload="metadata"`; closing or navigating releases the previous video
source.

Every video must remain fully visible with `object-contain`. No crop, autoplay,
loop, moving card preview or eager MP4 request is introduced.

## Validation

- Verify the release copies with ffprobe: H.264, yuv420p, AAC, expected ratio,
  duration, frame rate, bitrate and explicit Rec.709 metadata.
- Verify faststart and record byte size plus SHA-256 in the release manifest.
- Verify each object returns `Content-Type: video/mp4`, supports byte ranges and
  is playable from the deployed Cloudflare Pages origin.
- Run lint, type checking, content validation, component tests and static build.
- Confirm the static export contains no MP4 files and no video source in the
  initial HTML.
- Check all three cards and lightbox playback at desktop and mobile widths,
  including Close, Previous/Next, keyboard focus, media cleanup and error retry.

## Alternatives considered

1. One card with a format selector. Rejected for this stage because it changes
   the approved lightbox, expands the data model and complicates validation and
   navigation.
2. Automatic landscape/portrait selection by device. Rejected because the cuts
   have different durations and are separate creative adaptations; automatic
   selection would hide work from the viewer.
3. A carousel of the three variants. Rejected because carousels are outside the
   approved portfolio design and add unnecessary interaction.
