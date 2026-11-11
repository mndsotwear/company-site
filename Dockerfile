# ایمیج سایت شاهین مارین (Next.js + Payload)
# ساخت: docker build -t shahin-marine .
# اجرا روی سرور با docker compose (فایل deploy/docker-compose.yml)

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- ۱) نصب وابستگی‌ها ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- ۲) ساخت سایت ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# هنگام ساخت به دیتابیس واقعی نیازی نیست؛ صفحه‌ها در زمان اجرا از دیتابیس خوانده می‌شوند
ARG DATABASE_URI=postgres://build:build@localhost:5432/build
ARG PAYLOAD_SECRET=build-time-secret-not-used-at-runtime
ENV DATABASE_URI=$DATABASE_URI PAYLOAD_SECRET=$PAYLOAD_SECRET
RUN npm run build

# ---- ۳) ایمیج نهایی (فقط فایل‌های اجرا) ----
FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
# پوشه‌های عکس‌ها و فایل‌های اکسل روی volume نگه داشته می‌شوند
RUN mkdir -p media imports && chown app:app media imports
USER app
EXPOSE 3000
CMD ["node", "server.js"]
