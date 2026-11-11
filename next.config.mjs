import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

// متن‌های ثابت دو زبان از این فایل خوانده می‌شوند
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // کتابخانه‌ی خواندن اکسل فقط سمت سرور و بدون باندل شدن اجرا شود
  serverExternalPackages: ['exceljs'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
