# Uniform video card grid

## Decision

Use equal `4:3` poster frames for all work cards. Crop only the poster preview;
the lightbox continues to display every video in its original aspect ratio with
`object-contain`.

## Layout

- Desktop: three equal columns so the three Boots variants form one balanced row.
- Tablet: two columns.
- Mobile: one column.
- Keep titles and metadata below each image on a consistent baseline.
- Keep the entire card clickable and retain the existing play indicator.

## Cropping

Use `object-cover` for card posters and store an optional focal position with a
work entry. The initial Boots positions match the approved preview:

- Landscape: `50% 50%`
- Square: `50% 46%`
- Vertical: `50% 45%`

Future works default to centered cropping when no focal position is provided.

## Unchanged behaviour

- No autoplay or eager MP4 loading.
- Lightbox videos remain uncropped.
- Keyboard, mobile and error-handling behaviour remains unchanged.

## Verification and rollout

Update component and browser tests for the `4:3` crop and responsive column
counts. Run quality checks, build and browser tests, then publish only after the
approved preview has been reproduced by the implementation.

