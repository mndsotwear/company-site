import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, isAdmin } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { fa: 'کاربر', en: 'User' }, plural: { fa: 'کاربران', en: 'Users' } },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'] },
  auth: true,
  access: {
    // اولین کاربر بدون ورود ساخته می‌شود؛ بعد از آن فقط مدیر کاربر می‌سازد
    create: ({ req: { user } }) => !user || isAdmin(user as { role?: 'admin' | 'editor' }),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user }, id }) =>
      isAdmin(user as { role?: 'admin' | 'editor' }) || user?.id === id,
    delete: adminOnly,
  },
  hooks: {
    // اولین کاربری که ساخته می‌شود خودکار «مدیر» می‌شود
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users' })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: { fa: 'نام', en: 'Name' }, required: true },
    {
      name: 'role',
      type: 'select',
      label: { fa: 'نقش', en: 'Role' },
      required: true,
      defaultValue: 'editor',
      options: [
        { value: 'admin', label: { fa: 'مدیر', en: 'Admin' } },
        { value: 'editor', label: { fa: 'ویرایشگر', en: 'Editor' } },
      ],
      access: { update: adminOnlyField },
      saveToJWT: true,
    },
  ],
}
