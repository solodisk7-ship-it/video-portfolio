# Release QA

- На первом экране нет запросов .mp4; видео появляется только после открытия карточки.
- MP4 возвращает Content-Type: video/mp4, Accept-Ranges: bytes и 206 на Range.
- После закрытия или навигации старый video src удалён.
- Retry работает при offline/404/5xx.
- 16:9, 1:1, 4:5, 9:16 показаны без crop и растяжения.
- Первые 6 работ видимы сразу; Load More добавляет не более 12.
- Escape закрывает dialog; Tab не выходит из него; фокус возвращается в карточку.
- Arrow Left/Right не перехватываются, когда фокус на native video controls.
- Все интерактивные зоны не меньше 44×44 px, touch и клавиатура работают.
- На 360, 390, 430 px и desktop нет горизонтального scroll.
- Chrome, Edge, Firefox, Safari iOS и Chrome Android проверены вручную.
- Полный локальный Playwright-набор: задайте PLAYWRIGHT_CROSS_BROWSER=1; в CI
  Firefox и WebKit включаются автоматически.
- При 200% zoom контент не перекрывается и остаётся доступным.
- WebVTT включается для ролика с речью.
- Lighthouse: LCP ≤ 2.5 s, CLS ≤ 0.1.
- Cloudflare `/release.json` содержит commit, опубликованный из ветки `main` GitHub.
