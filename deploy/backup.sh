#!/bin/sh
# بکاپ روزانه‌ی دیتابیس و فایل‌ها؛ ۷ نسخه‌ی آخر نگه داشته می‌شود
# روی سرور در crontab:  0 3 * * * /opt/shahin/deploy/backup.sh
set -e
cd "$(dirname "$0")"
DIR=./backups
STAMP=$(date +%Y-%m-%d)
mkdir -p "$DIR"
docker compose exec -T db pg_dump -U shahin shahin_marine | gzip > "$DIR/db-$STAMP.sql.gz"
tar -czf "$DIR/files-$STAMP.tar.gz" media imports
ls -1t "$DIR"/db-*.sql.gz | tail -n +8 | xargs -r rm --
ls -1t "$DIR"/files-*.tar.gz | tail -n +8 | xargs -r rm --
echo "backup $STAMP done"
