# Remove the duplicate CSS watermark

## Decision

Keep the `Portfolio` watermark embedded in each published MP4 and remove the
second watermark rendered by the website over the video player.

## Scope

- Remove the watermark overlay from the work lightbox.
- Remove the now-unused public watermark setting.
- Update component tests and media-pipeline documentation so the embedded
  watermark is the only required visual mark.
- Do not re-encode or re-upload the three Boots videos.

## Verification

- Run the project quality checks and static build.
- Run the browser tests to confirm the lightbox still opens, plays and closes.
- Publish the change and confirm the deployed commit is live.

