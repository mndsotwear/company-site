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
      ],
    },
  ],
}
