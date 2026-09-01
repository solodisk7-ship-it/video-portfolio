# Video portfolio

Статическое англоязычное видеопортфолио на Next.js. Исходный код хранится в
GitHub, а готовая папка `out/` публикуется в Cloudflare Pages. Видео не
запрашиваются до открытия lightbox.

## Локальный запуск

Требуются Node.js 24.12.0 и pnpm 10.26.2.

```powershell
corepack enable
corepack prepare pnpm@10.26.2 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Основные проверки:

```powershell
pnpm quality
pnpm build
pnpm test:e2e
```

`pnpm build` создаёт переносимую папку `out/`. Команда
`pnpm release:prepare` дополнительно включает строгий production-gate и
намеренно завершается ошибкой, пока в проекте остаются демо-данные.

## Где менять данные

- `content/works.ts` — все работы, их порядок и видимость.
- `content/site-config.ts` — публичное имя для SEO, адрес сайта, адрес видеохранилища и контакты.
- `ops/release-manifest.json` — контрольные суммы и технические параметры видео.
- `public/works/*.webp` — обложки.
- `public/**/*.vtt` — опциональные субтитры.

Инструкции по операциям с работами находятся в
[docs/content-operations.md](docs/content-operations.md), подготовка видео — в
[docs/media-pipeline.md](docs/media-pipeline.md), публикация — в
[docs/deployment.md](docs/deployment.md).

## Текущее состояние

Сейчас каталог имеет статус `demo`: 12 тестовых обложек используют один
локальный тестовый ролик. Это позволяет проверить интерфейс и технический адрес
Cloudflare Pages, но не пройти `pnpm validate:release`. Для финального запуска
нужны 30–50 реальных работ, 6 Featured, рабочие контакты, HTTPS-адрес
видеохранилища и заполненный manifest.

Исходные Word-документы, мастер-видео, исходные PNG, ключи и локальные заметки не
публикуются — они исключены через `.gitignore`.
