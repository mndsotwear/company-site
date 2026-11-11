# راه‌اندازی سایت روی سرور

سرور پیشنهادی: لینوکس Ubuntu 24.04، حداقل ۲ هسته، ۴ گیگ رم، ۴۰ گیگ SSD.

## ۱) روی کامپیوتر خودتان: ساخت ایمیج
چون npm از داخل ایران روی سرور ممکن است کند باشد، ایمیج روی کامپیوتر ساخته و به سرور فرستاده می‌شود:

```bash
docker build -t shahin-marine .
docker save shahin-marine | gzip > shahin-marine.tar.gz
scp shahin-marine.tar.gz deploy/* root@SERVER:/opt/shahin/deploy/
```

## ۲) روی سرور
```bash
cd /opt/shahin/deploy
docker load < shahin-marine.tar.gz
cp ../.env.example .env   # یا فایل .env را بسازید و مقادیر را پر کنید
```

در `.env` حتماً این‌ها را بنویسید:
- `DB_PASSWORD` رمز قوی دیتابیس
- `PAYLOAD_SECRET` متن تصادفی بلند
- `NEXT_PUBLIC_SITE_URL=https://shahinmarine.com`
- SMTP و کاوه‌نگار (برای ایمیل و پیامک)

```bash
docker compose up -d
```
بار اول جدول‌های دیتابیس خودکار ساخته می‌شوند (migration).

## ۳) دامنه و SSL
```bash
apt install nginx certbot python3-certbot-nginx
cp nginx.conf /etc/nginx/sites-available/shahinmarine.com
ln -s /etc/nginx/sites-available/shahinmarine.com /etc/nginx/sites-enabled/
certbot --nginx -d shahinmarine.com -d www.shahinmarine.com
systemctl reload nginx
```

## ۴) بکاپ روزانه
```bash
crontab -e
# این خط را اضافه کنید (ساعت ۳ بامداد):
0 3 * * * /opt/shahin/deploy/backup.sh
```

## ۵) انتقال داده‌ها از کامپیوتر به سرور
صفحه‌ها، کشتی‌ها و تنظیمات پنل در دیتابیس کامپیوتر شما هستند. برای انتقال:
```bash
pg_dump -h localhost -p 5433 -U postgres shahin_marine > data.sql      # روی کامپیوتر
docker compose exec -T db psql -U shahin shahin_marine < data.sql      # روی سرور
```
پوشه‌ی `media` (عکس‌ها) را هم کنار `docker-compose.yml` کپی کنید.

## ۶) هر بار به‌روزرسانی
ایمیج جدید را بسازید و بفرستید، بعد روی سرور: `docker load < ... && docker compose up -d`
اگر کالکشن یا فیلدی در پنل اضافه شده باشد، قبل از ساخت ایمیج روی کامپیوتر بزنید:
`npx payload migrate:create نام-تغییر`
