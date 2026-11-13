# Browser media fixture

`playback.webm` is a generated one-second, silent, 96×54 gray VP8 clip. It is only used to intercept video responses in UI tests; it is never imported by the application or copied to `public/` or `out/`.

Regenerate a missing fixture with:

```sh
ffmpeg -hide_banner -loglevel error -n -f lavfi -i "color=c=gray:s=96x54:r=12:d=1" -an -c:v libvpx -b:v 25k tests/fixtures/playback.webm
```

UI checks are independent of the public video bucket. `pnpm test:media` separately checks actual MP4 Range/MIME/CORS responses without publishing anything.
