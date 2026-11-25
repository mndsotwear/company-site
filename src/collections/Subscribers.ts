import type { CollectionConfig } from 'payload'
import { adminOnly, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'

// اعضای خبرنامه (از فرم فوتر)
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: { fa: 'عضو خبرنامه', en: 'Subscriber' }, plural: { fa: 'اعضای خبرنامه', en: 'Newsletter subscribers' } },
  admin: { group: GROUPS.requests, useAsTitle: 'email', defaultColumns: ['email', 'locale', 'createdAt'] },
  defaultSort: '-createdAt',
  access: { read: loggedIn, create: loggedIn, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'email', type: 'email', label: { fa: 'ایمیل', en: 'Email' }, required: true, unique: true },
    { name: 'locale', type: 'text', label: { fa: 'زبان', en: 'Language' }, admin: { readOnly: true } },
  ],
}
