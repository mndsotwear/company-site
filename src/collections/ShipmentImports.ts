import { APIError, type CollectionConfig } from 'payload'
import { adminOnly, loggedIn } from '../access/roles'
import { GROUPS } from '../lib/adminGroups'
import { importShipments } from '../lib/shipmentImport'

// ورود اکسل رهگیری: ادمین فایل را آپلود می‌کند، همان لحظه خوانده و در «خودروها» اضافه/به‌روز می‌شود
// و گزارش نتیجه در همین رکورد ذخیره می‌شود. فایل‌ها فقط برای کاربران پنل قابل دانلودند.
export const ShipmentImports: CollectionConfig = {
  slug: 'shipment-imports',
  labels: {
    singular: { fa: 'ورود اکسل', en: 'Excel import' },
    plural: { fa: 'ورود اکسل', en: 'Excel imports' },
  },
  admin: {
    group: GROUPS.tracking,
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'summary', 'createdAt'],
    description: {
      fa: 'فایل اکسل (xlsx) را آپلود و ذخیره کنید. ستون‌ها از روی اسمشان شناخته می‌شوند: شماره شاسی (الزامی)، نام مشتری، شمارهٔ تماس مشتری، مدل، رنگ، محل فعلی، وضعیت، توضیح، تاریخ. اگر شاسی قبلاً ثبت شده باشد به‌روز می‌شود، وگرنه اضافه می‌شود.',
      en: 'Upload an .xlsx file. Columns are matched by name: chassis (required), customer name, customer phone, model, color, current location, status, note, date. Existing chassis are updated, new ones added.',
    },
  },
  defaultSort: '-createdAt',
  access: { read: loggedIn, create: loggedIn, update: adminOnly, delete: adminOnly },
  upload: {
    staticDir: 'imports',
    mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation !== 'create') return data
        const file = req.file
        if (!file?.data) throw new APIError('فایل اکسل دریافت نشد.', 400, undefined, true)
        try {
          const report = await importShipments(req.payload, file.data)
          const { errors, ...counts } = report
          return { ...data, ...counts, rowErrors: errors }
        } catch (e) {
          // خطای ساختاری فایل (مثلاً ستون شاسی ندارد) به کاربر پنل نشان داده می‌شود
          throw new APIError(e instanceof Error ? e.message : 'فایل قابل خواندن نیست.', 400, undefined, true)
        }
      },
    ],
  },
  fields: [
    { name: 'summary', type: 'text', label: { fa: 'نتیجه', en: 'Result' }, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'total', type: 'number', label: { fa: 'کل سطرها', en: 'Rows' }, admin: { readOnly: true } },
        { name: 'created', type: 'number', label: { fa: 'جدید', en: 'New' }, admin: { readOnly: true } },
        { name: 'updated', type: 'number', label: { fa: 'به‌روز', en: 'Updated' }, admin: { readOnly: true } },
        { name: 'unchanged', type: 'number', label: { fa: 'بدون تغییر', en: 'Unchanged' }, admin: { readOnly: true } },
        { name: 'failed', type: 'number', label: { fa: 'خطا', en: 'Failed' }, admin: { readOnly: true } },
      ],
    },
    {
      name: 'rowErrors',
      type: 'array',
      label: { fa: 'سطرهای دارای خطا یا هشدار', en: 'Row errors / warnings' },
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'row', type: 'number', label: { fa: 'سطر', en: 'Row' } },
            { name: 'message', type: 'text', label: { fa: 'توضیح', en: 'Message' } },
          ],
        },
      ],
    },
  ],
}
