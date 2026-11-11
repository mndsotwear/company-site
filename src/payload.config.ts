import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
  },

  // بخش‌های پنل
  collections: [Pages, Services, Vessels, VesselInquiries, QuoteRequests, Shipments, ShipmentImports, Media, Users],
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

  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  sharp,
})
