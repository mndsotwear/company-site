import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { fa } from '@payloadcms/translations/languages/fa'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Services } from './collections/Services'
import { Vessels } from './collections/Vessels'
import { VesselInquiries } from './collections/VesselInquiries'
import { QuoteRequests } from './collections/QuoteRequests'
import { ContactMessages } from './collections/ContactMessages'
import { Shipments } from './collections/Shipments'
import { ShipmentImports } from './collections/ShipmentImports'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // پنل مدیریت
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' | شاهین مارین' },
    // کارت‌های خلاصه و دانلود اکسل بالای داشبورد
    components: { beforeDashboard: ['/components/admin/DashboardStats#DashboardStats'] },
  },

  // بخش‌های پنل
  collections: [Pages, Services, Vessels, VesselInquiries, QuoteRequests, ContactMessages, Shipments, ShipmentImports, Media, Users],
  globals: [SiteSettings],

  // ویرایشگر متن
  editor: lexicalEditor(),

  // زبان محتوا: هر فیلد localized دو نسخه‌ی فارسی و انگلیسی دارد
  localization: {
    locales: [
      { code: 'fa', label: 'فارسی', rtl: true },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'fa',
    fallback: true,
  },

  // زبان خود رابط پنل
  i18n: {
    supportedLanguages: { fa, en },
    fallbackLanguage: 'fa',
  },

  // ایمیل: اگر SMTP در .env وارد شده باشد ایمیل واقعی ارسال می‌شود، وگرنه فقط در ترمینال نوشته می‌شود
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@shahinmarine.com',
          defaultFromName: 'شاهین مارین',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 465),
            secure: Number(process.env.SMTP_PORT || 465) === 465,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          },
        }),
      }
    : {}),

  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  sharp,
})
