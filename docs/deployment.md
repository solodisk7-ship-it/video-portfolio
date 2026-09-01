# Публикация

## 1. Технический демо-сайт

Репозиторий GitHub подключается к Cloudflare Pages. Для временного демо можно
использовать обычную статическую сборку:

- Production branch: `main`
- Build command: `pnpm build`
- Build output directory: `out`
- Node.js: `24.12.0`
- Environment variable: `PNPM_VERSION=10.26.2`

Каждый push в `main` запускает новую сборку. Pull request получает отдельный
preview URL.

## 2. Production gate

Перед финальным релизом заполните `content/site-config.ts`, замените весь
демо-каталог и manifest, затем выполните:

```powershell
pnpm release:prepare
```

Команда проверяет 30–50 видимых работ, ровно 6 Featured, уникальность,
локальные WebP/VTT, versioned video keys, manifest и отсутствие публичных
placeholders.

## 3. Резервная ручная публикация

Если Git integration недоступен, авторизуйте Wrangler и отправьте тот же `out/`
напрямую:

```powershell
pnpm exec wrangler login
pnpm build
pnpm exec wrangler pages deploy out --project-name video-portfolio
```

Для финального production-релиза вместо `pnpm build` используйте
`pnpm release:prepare`.

## 4. Проверка релиза

Проверьте опубликованный commit:

```powershell
curl.exe https://video-portfolio-3s4.pages.dev/release.json
```

Сначала используйте технический адрес `pages.dev`. Собственный домен
подключается отдельным этапом после полного QA.
