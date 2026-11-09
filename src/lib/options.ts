// گزینه‌های مشترک فرم‌ها؛ هم در پنل و هم در فرم‌های سایت استفاده می‌شوند
// تا متن‌ها و مقدارها همه‌جا یکسان بمانند.

type Label = { fa: string; en: string }
export type Option = { value: string; label: Label }

export const SERVICE_OPTIONS: Option[] = [
  { value: 'sea', label: { fa: 'حمل دریایی', en: 'Sea freight' } },
  { value: 'sea-road', label: { fa: 'حمل ترکیبی دریایی و جاده‌ای', en: 'Combined sea & road' } },
  { value: 'other', label: { fa: 'سایر', en: 'Other' } },
]

export const ORIGIN_OPTIONS: Option[] = [
  { value: 'abadan', label: { fa: 'بندر آبادان', en: 'Abadan port' } },
  { value: 'khorramshahr', label: { fa: 'بندر خرمشهر', en: 'Khorramshahr port' } },
  { value: 'other', label: { fa: 'سایر', en: 'Other' } },
]

export const DESTINATION_OPTIONS: Option[] = [
  { value: 'umm-qasr', label: { fa: 'بندر ام‌القصر (عراق)', en: 'Umm Qasr (Iraq)' } },
  { value: 'basra', label: { fa: 'بندر بصره (عراق)', en: 'Basra (Iraq)' } },
  { value: 'kuwait', label: { fa: 'کویت', en: 'Kuwait' } },
  { value: 'dubai', label: { fa: 'دبی (امارات)', en: 'Dubai (UAE)' } },
  { value: 'other', label: { fa: 'سایر', en: 'Other' } },
]

export const CARGO_OPTIONS: Option[] = [
  { value: 'container-20', label: { fa: 'کانتینر ۲۰ فوت', en: '20ft container' } },
  { value: 'container-40', label: { fa: 'کانتینر ۴۰ فوت', en: '40ft container' } },
  { value: 'bulk', label: { fa: 'فله', en: 'Bulk' } },
  { value: 'vehicle', label: { fa: 'خودرو', en: 'Vehicle' } },
  { value: 'heavy-equipment', label: { fa: 'تجهیزات سنگین', en: 'Heavy equipment' } },
  { value: 'general', label: { fa: 'کالای عمومی', en: 'General cargo' } },
  { value: 'other', label: { fa: 'سایر', en: 'Other' } },
]

export const TIMING_OPTIONS: Option[] = [
  { value: 'asap', label: { fa: 'هرچه زودتر', en: 'As soon as possible' } },
  { value: 'this-week', label: { fa: 'طی همین هفته', en: 'This week' } },
  { value: 'this-month', label: { fa: 'طی همین ماه', en: 'This month' } },
  { value: 'next-month', label: { fa: 'ماه آینده', en: 'Next month' } },
  { value: 'unknown', label: { fa: 'هنوز مشخص نیست', en: 'Not decided yet' } },
  { value: 'other', label: { fa: 'سایر', en: 'Other' } },
]

export const CONTACT_VIA_OPTIONS: Option[] = [
  { value: 'phone', label: { fa: 'تلفن', en: 'Phone' } },
  { value: 'whatsapp', label: { fa: 'واتساپ', en: 'WhatsApp' } },
  { value: 'email', label: { fa: 'ایمیل', en: 'Email' } },
]

export const VESSEL_TYPE_OPTIONS: Option[] = [
  { value: 'bulk-carrier', label: { fa: 'فله‌بر', en: 'Bulk carrier' } },
  { value: 'general-cargo', label: { fa: 'کالای عمومی', en: 'General cargo' } },
  { value: 'container', label: { fa: 'کانتینربر', en: 'Container ship' } },
  { value: 'landing-craft', label: { fa: 'لندینگ‌کرافت', en: 'Landing craft' } },
  { value: 'tanker', label: { fa: 'نفتکش / تانکر', en: 'Tanker' } },
  { value: 'tug', label: { fa: 'یدک‌کش', en: 'Tug' } },
  { value: 'other', label: { fa: 'سایر', en: 'Other' } },
]

export const VESSEL_STATUS_OPTIONS: Option[] = [
  { value: 'available', label: { fa: 'موجود', en: 'Available' } },
  { value: 'reserved', label: { fa: 'رزرو شده', en: 'Reserved' } },
  { value: 'sold', label: { fa: 'فروخته شد', en: 'Sold' } },
]

/** تبدیل به قالب گزینه‌های Payload */
export const toPayloadOptions = (opts: Option[]) =>
  opts.map((o) => ({ value: o.value, label: o.label }))

/** برچسب یک مقدار به زبان دلخواه */
export const labelOf = (opts: Option[], value: string | null | undefined, locale: 'fa' | 'en' = 'fa') =>
  opts.find((o) => o.value === value)?.label[locale] ?? value ?? ''
