# Подготовка и хранение медиа

## Web-MP4

Master-файлы остаются локально и не попадают в Git. Для web-версии используйте
H.264, yuv420p, AAC, faststart, SDR Rec.709. Ориентир — 15–30 МБ на 30 секунд.

Пример FFmpeg без изменения геометрии:

~~~powershell
ffmpeg -i master.mov -map_metadata -1 -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 160k -movflags +faststart project-name-v01.mp4
~~~

Если ролик без звука, замените аудиопараметры на -an. Не растягивайте исходник:
допустимы 16:9, 1:1, 4:5, 9:16.

### Watermark и защита web-копии

Перед production-публикацией watermark должен быть встроен непосредственно в
web-MP4 при экспорте или кодировании. Используйте тот же текст или знак, который
задан в `siteConfig.videoProtection.watermarkLabel`, с непрозрачностью 45–60% и
отступом от края. Не добавляйте watermark в master-файл.

Lightbox дополнительно скрывает обычную кнопку скачивания и показывает экранный
watermark. Эти меры затрудняют случайное копирование, но не являются DRM и не
могут запретить извлечение данных из браузера или запись экрана. CSS-watermark не
заменяет встроенную маркировку web-MP4.

Проверка:

~~~powershell
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,pix_fmt,width,height,color_space -of json project-name-v01.mp4
Get-FileHash -Algorithm SHA256 project-name-v01.mp4
~~~

## Обложки

Выберите осмысленный таймкод, экспортируйте PNG и запустите:

~~~powershell
python scripts/optimize-posters.py
~~~

Скрипт создаёт WebP с максимальной стороной 1600 px. Цель — до 250 КБ, жёсткий
лимит — 400 КБ. Исходные PNG храните в assets/source-posters/, не в public/.

## Загрузка в Yandex Object Storage

Ключи доступа хранятся только в локальном профиле CLI. Пример загрузки с
явными MIME и cache headers:

~~~powershell
yc storage s3api put-object --bucket BUCKET --key videos/project-name-v01.mp4 --body ./project-name-v01.mp4 --content-type video/mp4 --cache-control "public,max-age=31536000,immutable"
~~~

Публичный base URL записывается один раз в content/site-config.ts.

Для бакета разрешите `GET` и `HEAD` только с production-адреса Cloudflare и
будущего домена. Шаблон находится в `ops/cors.example.json`.
Проверяйте Content-Type: video/mp4, Accept-Ranges: bytes и ответ 206:

~~~powershell
curl.exe -I https://storage.yandexcloud.net/BUCKET/videos/project-name-v01.mp4
curl.exe -I -H "Range: bytes=0-1023" https://storage.yandexcloud.net/BUCKET/videos/project-name-v01.mp4
~~~

Старые web-копии перемещаются в retired/. Для этого префикса применяется
ops/lifecycle.example.json с удалением через 30 дней. Перед применением
обязательно замените имя бакета и проверьте текущие lifecycle rules.

Master, исходная обложка и опубликованный web-файл сохраняются в локальном
архиве бессрочно.
