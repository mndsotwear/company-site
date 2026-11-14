import type { GlobalConfig } from 'payload'
import { adminOnlyField, anyone, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'

const navItem = [
  {
    type: 'row' as const,
    fields: [
      { name: 'label', type: 'text' as const, label: { fa: 'متن', en: 'Label' }, required: true, localized: true },
      {
        name: 'href',
        type: 'text' as const,
        label: { fa: 'آدرس', en: 'Link' },
        required: true,
        admin: { description: { fa: 'مثل /about (بدون /fa)', en: 'e.g. /about (without /fa)' } },
      },
    ],
  },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { fa: 'تنظیمات سایت', en: 'Site settings' },
  admin: { group: GROUPS.system },
  access: { read: anyone, update: loggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { fa: 'لوگو', en: 'Brand' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', label: { fa: 'لوگو (زمینه روشن)', en: 'Logo (light background)' } },
                { name: 'logoDark', type: 'upload', relationTo: 'media', label: { fa: 'لوگو (زمینه تیره)', en: 'Logo (dark background)' } },
              ],
            },
          ],
        },
        {
          label: { fa: 'منو', en: 'Menu' },
          fields: [
            {
              name: 'headerNav',
              type: 'array',
              label: { fa: 'منوی بالای سایت', en: 'Header menu' },
              labels: { singular: { fa: 'لینک', en: 'Link' }, plural: { fa: 'لینک‌ها', en: 'Links' } },
              maxRows: 8,
              admin: { description: { fa: 'خالی = منوی پیش‌فرض', en: 'Empty = default menu' } },
              fields: navItem,
            },
            {
              name: 'footerNav',
              type: 'array',
              label: { fa: 'لینک‌های مفید فوتر', en: 'Footer links' },
              labels: { singular: { fa: 'لینک', en: 'Link' }, plural: { fa: 'لینک‌ها', en: 'Links' } },
              maxRows: 10,
              fields: navItem,
            },
          ],
        },
        {
          label: { fa: 'اطلاعات تماس', en: 'Contact' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', label: { fa: 'تلفن', en: 'Phone' }, defaultValue: '09366334228' },
                { name: 'whatsapp', type: 'text', label: { fa: 'شماره واتساپ', en: 'WhatsApp' }, defaultValue: '09366334228' },
                { name: 'email', type: 'email', label: { fa: 'ایمیل', en: 'Email' }, defaultValue: 'shahin.marine1@gmail.com' },
              ],
            },
            { name: 'address', type: 'text', label: { fa: 'آدرس', en: 'Address' }, localized: true },
            { name: 'mapUrl', type: 'text', label: { fa: 'لینک نقشه (گوگل یا نشان)', en: 'Map link' } },
          ],
        },
        {
          label: { fa: 'شبکه‌های اجتماعی', en: 'Social' },
          fields: [
            {
              name: 'socials',
              type: 'array',
              label: { fa: 'شبکه‌ها', en: 'Networks' },
              labels: { singular: { fa: 'شبکه', en: 'Network' }, plural: { fa: 'شبکه‌ها', en: 'Networks' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      label: { fa: 'شبکه', en: 'Platform' },
                      required: true,
                      options: [
                        { value: 'instagram', label: 'Instagram' },
                        { value: 'telegram', label: 'Telegram' },
                        { value: 'linkedin', label: 'LinkedIn' },
                        { value: 'whatsapp', label: 'WhatsApp' },
                        { value: 'eitaa', label: { fa: 'ایتا', en: 'Eitaa' } },
                        { value: 'bale', label: { fa: 'بله', en: 'Bale' } },
                      ],
                    },
                    { name: 'url', type: 'text', label: { fa: 'آدرس', en: 'URL' }, required: true },
                  ],
                },
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
          description: {
            fa: 'استعلام‌ها و درخواست‌های خرید کشتی به این شماره و ایمیل اطلاع داده می‌شوند. فقط مدیر می‌تواند تغییر دهد.',
            en: 'New quotes and vessel inquiries are sent here. Admin only.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'notifyPhone',
                  type: 'text',
                  label: { fa: 'شماره دریافت پیامک مدیر', en: 'Admin SMS number' },
                  access: { update: adminOnlyField },
                },
                {
                  name: 'notifyEmail',
                  type: 'email',
                  label: { fa: 'ایمیل دریافت اعلان‌ها', en: 'Notification email' },
                  access: { update: adminOnlyField },
                },
              ],
            },
          ],
        },
        {
          label: { fa: 'ظاهر سایت', en: 'Appearance' },
          description: {
            fa: 'تم پیش‌فرض برای بازدیدکننده‌ای که هنوز خودش تمی انتخاب نکرده. بازدیدکننده می‌تواند از دکمه‌ی رنگ در هدر تم را عوض کند.',
            en: 'Default theme for visitors who have not picked one. Visitors can change it with the colour button in the header.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultPalette',
                  type: 'select',
                  defaultValue: 'ocean',
                  label: { fa: 'پالت رنگ پیش‌فرض', en: 'Default palette' },
                  options: [
                    { value: 'ocean', label: { fa: 'اقیانوس عمیق', en: 'Deep ocean' } },
                    { value: 'midnight', label: { fa: 'نیمه‌شب و طلا', en: 'Midnight & gold' } },
                    { value: 'classic', label: { fa: 'شاهین کلاسیک', en: 'Shahin classic' } },
                    { value: 'coral', label: { fa: 'غروب مرجانی', en: 'Coral sunset' } },
                    { value: 'custom', label: { fa: 'رنگ دلخواه', en: 'Custom colour' } },
                  ],
                },
                {
                  name: 'customColor',
                  type: 'text',
                  defaultValue: '#22d3ee',
                  label: { fa: 'رنگ دلخواه (کد هگز مثل #22d3ee)', en: 'Custom colour (hex)' },
                  validate: (v: unknown) => (!v || /^#[0-9a-fA-F]{6}$/.test(String(v)) ? true : 'مثلاً #22d3ee'),
                  admin: { condition: (data) => data?.defaultPalette === 'custom' },
                },
                {
                  name: 'defaultMode',
                  type: 'select',
                  defaultValue: 'dark',
                  label: { fa: 'حالت پیش‌فرض', en: 'Default mode' },
                  options: [
                    { value: 'dark', label: { fa: 'تیره', en: 'Dark' } },
                    { value: 'light', label: { fa: 'روشن', en: 'Light' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { fa: 'رهگیری', en: 'Tracking' },
          fields: [
            {
              name: 'trackingSms',
              type: 'checkbox',
              defaultValue: false,
              label: { fa: 'ارسال پیامک به مشتری وقتی وضعیت خودرو عوض می‌شود', en: 'SMS the customer when a vehicle status changes' },
              admin: {
                description: {
                  fa: 'فقط برای شماره‌های موبایل ایران و فقط وقتی «وضعیت» تغییر کند (با ورود اکسل یا ویرایش دستی). اولین ثبت خودرو پیامک نمی‌فرستد.',
                  en: 'Iranian mobiles only, and only when the status changes. First registration does not send an SMS.',
                },
              },
            },
            {
              name: 'statusTranslations',
              type: 'array',
              label: { fa: 'ترجمه‌ی وضعیت‌ها برای نسخه‌ی انگلیسی', en: 'Status translations (English site)' },
              labels: { singular: { fa: 'وضعیت', en: 'Status' }, plural: { fa: 'وضعیت‌ها', en: 'Statuses' } },
              admin: {
                description: {
                  fa: 'وضعیت‌ها و محل‌ها همان متن اکسل‌اند. اگر اینجا ترجمه‌ای ثبت شود، در سایت انگلیسی به‌جای متن فارسی نمایش داده می‌شود.',
                  en: 'Statuses and locations come from Excel as written. Add an English text here to show it on the English site.',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'fa', type: 'text', label: { fa: 'متن فارسی (دقیقاً مثل اکسل)', en: 'Persian text (as in Excel)' }, required: true },
                    { name: 'en', type: 'text', label: { fa: 'ترجمه‌ی انگلیسی', en: 'English' }, required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
