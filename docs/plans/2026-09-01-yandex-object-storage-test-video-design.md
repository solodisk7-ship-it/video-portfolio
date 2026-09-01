# Yandex Object Storage test video

## Status

Approved on 2026-09-01.

## Goal

Verify the complete production media path from the Cloudflare Pages portfolio to
the public Yandex Object Storage bucket before final portfolio videos are ready.

## Decision

Use the already uploaded temporary object `xionic2.mp4.mp4` for every demo work.
The deliberately temporary double extension is acceptable while
`siteConfig.contentStatus` remains `demo`.

The site will use this media base URL:

`https://storage.yandexcloud.net/portfolio-nonstoplife26-media`

All demo `videoKey` values will temporarily point to `xionic2.mp4.mp4`. Posters,
work metadata, the lightbox and download-deterrence controls remain unchanged.

## Alternatives considered

1. Re-upload the test file under the final versioned naming convention. Rejected
   because it adds manual work for an object that will not be published as a real
   portfolio item.
2. Leave the website on its bundled local demo MP4. Rejected because HTTP header
   checks alone do not validate the complete Cloudflare-to-Yandex playback path.

## Verified storage behavior

- Public object response: `200 OK`.
- MIME type: `video/mp4`.
- Byte-range response: `206 Partial Content`.
- CORS origin: `https://video-portfolio-3s4.pages.dev`.
- Allowed methods: `GET, HEAD`.
- Allowed request header: `Range`.

## Implementation and validation

1. Update `siteConfig.mediaBaseUrl` to the public Yandex Object Storage endpoint.
2. Replace the shared demo video key with `xionic2.mp4.mp4`.
3. Run lint, strict type checking, content validation, tests and static build.
4. Commit and push the change to `main` for automatic Cloudflare Pages deployment.
5. Manually open a work and confirm playback and seeking on the deployed site.

## Cleanup before production

Replace every demo catalogue entry with final metadata and a versioned key such
as `videos/project-slug-v01.mp4`, set `contentStatus` to `production`, and remove
the temporary `xionic2.mp4.mp4` object after the final media is verified.
