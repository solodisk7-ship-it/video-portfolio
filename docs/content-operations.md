# Сопровождение каталога без CMS

Все операции выполняются в content/works.ts. После правки запускайте
pnpm validate:content, затем pnpm build.

## Добавить работу

1. Подготовьте slug-v01.mp4 и WebP-обложку.
2. Загрузите MP4 в Object Storage с Content-Type: video/mp4.
3. Добавьте объект Work; order и slug должны быть уникальными.
4. Для Featured поставьте featured: true. Среди видимых работ их всегда ровно 6.
5. Добавьте техническую запись в ops/release-manifest.json.

~~~ts
{
  slug: 'project-name',
  title: 'Project Name',
  category: 'Social Campaign',
  role: 'Motion Design',
  year: 2026,
  ratio: '9:16',
  poster: '/works/project-name.webp',
  videoKey: 'videos/project-name-v01.mp4',
  featured: false,
  order: 13,
  visible: true,
}
~~~

Если в ролике есть речь, добавьте captions: '/captions/project-name.en.vtt'.

## Заменить видео

1. Не перезаписывайте существующий объект.
2. Загрузите project-name-v02.mp4.
3. В каталоге измените только videoKey.
4. Обновите manifest и соберите сайт.
5. После проверки перенесите старый объект в префикс retired/. Lifecycle удалит
   его через 30 дней; master-файл останется в локальном архиве.

Так rollback не зависит от кеша и не требует восстановления перезаписанного файла.

## Скрыть, вернуть и изменить порядок

- Скрыть: visible: false. Объект и manifest не удаляйте до завершения периода rollback.
- Вернуть: visible: true, затем проверьте число Featured.
- Поменять порядок: измените уникальные целые order.
- Убрать из Featured: назначьте другую видимую работу Featured в том же коммите.

## Rollback

1. Верните предыдущий videoKey и соответствующую запись manifest.
2. Если объект уже в retired/, скопируйте его обратно в videos/.
3. Соберите и опубликуйте тот же commit на обе площадки.
4. Проверьте /release.json и воспроизведение с Range/206.
