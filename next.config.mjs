import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

// متن‌های ثابت دو زبان از این فایل خوانده می‌شوند
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// ریدایرکت ۳۰۱ از آدرس‌های سایت وردپرسی قبلی تا رتبه‌ی گوگل و لینک‌های قدیمی از دست نرود
const WP_REDIRECTS = [
  ['/درباره-ما', '/fa/about'],
  ['/خدمات', '/fa/services'],
  ['/حمل-و-نقل-دریایی', '/fa/services/sea-freight'],
  ['/تماس-با-ما', '/fa/contact'],
  ['/tracking', '/fa/tracking'],
  ['/quote', '/fa/quote'],
  ['/سیاست-حفظ-حریم-خصوصی', '/fa/privacy'],
  ['/حمل-و-نقل-هوایی', '/fa/services'],
  ['/air-freight', '/fa/services'],
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return WP_REDIRECTS.map(([from, to]) => ({ source: encodeURI(from), destination: to, permanent: true }))
  },
  // کتابخانه‌ی خواندن اکسل فقط سمت سرور و بدون باندل شدن اجرا شود
  serverExternalPackages: ['exceljs'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
