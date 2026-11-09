import type { GlobalConfig } from 'payload'
import { anyone, loggedIn } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { fa: 'تنظیمات سایت', en: 'Site settings' },
  access: { read: anyone, update: loggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { fa: 'اطلاعات تماس', en: 'Contact' },
          fields: [
            { name: 'phone', type: 'text', label: { fa: 'تلفن', en: 'Phone' }, defaultValue: '09366334228' },
            { name: 'whatsapp', type: 'text', label: { fa: 'شماره واتساپ', en: 'WhatsApp' }, defaultValue: '09366334228' },
            { name: 'email', type: 'email', label: { fa: 'ایمیل', en: 'Email' }, defaultValue: 'shahin.marine1@gmail.com' },
            { name: 'address', type: 'text', label: { fa: 'آدرس', en: 'Address' }, localized: true },
            { name: 'mapUrl', type: 'text', label: { fa: 'لینک نقشه', en: 'Map link' } },
          ],
        },
        {
          label: { fa: 'شبکه‌های اجتماعی', en: 'Social' },
          fields: [
            {
              name: 'socials',
              type: 'array',
              label: { fa: 'شبکه‌ها', en: 'Networks' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: ['instagram', 'telegram', 'linkedin', 'whatsapp'],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: { fa: 'فوتر', en: 'Footer' },
          fields: [
            { name: 'footerAbout', type: 'textarea', label: { fa: 'متن کوتاه فوتر', en: 'Footer text' }, localized: true },
          ],
        },
        {
          label: { fa: 'اعلان‌ها', en: 'Notifications' },
          fields: [
            { name: 'notifyPhone', type: 'text', label: { fa: 'شماره دریافت پیامک مدیر', en: 'Admin SMS number' } },
            { name: 'notifyEmail', type: 'email', label: { fa: 'ایمیل دریافت اعلان‌ها', en: 'Notification email' } },
          ],
        },
      ],
    },
  ],
}
