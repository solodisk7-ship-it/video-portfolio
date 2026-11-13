# Публикация

## Текущий режим: только локальная demo-версия

По решению владельца от 16.09.2026 сайт продолжает наполняться локально.
`contentStatus: 'demo'` сохраняется. Не запускать deploy, не создавать облачные
preview и не отправлять коммиты в GitHub без отдельного разрешения: push в `main`
может автоматически обновить существующий сайт. Настройка CI в файлах сама по
себе не запускает GitHub Actions.

Для локальной проверки: `pnpm quality`, `pnpm build`, `pnpm test:e2e`.
Для просмотра: `pnpm start`, адрес http://127.0.0.1:4173.
Ошибка `pnpm validate:release` в demo ожидаема: защита финального релиза включена.
Ниже — справка для будущей публикации, не команда к её выполнению сейчас.

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

Команда требует явно выбранный production-статус, минимум одну видимую работу
и одну видимую Featured, уникальность, локальные WebP/VTT, обложку ссылки из
видимых работ, versioned video keys, финальный manifest с Git SHA и отсутствие
публичных placeholders. Фиксированных 6/11 Featured и минимума 30–50 работ нет.
Демо-manifest с `local-demo` не нужно подменять фиктивным SHA ради прохождения проверки.

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
