/**
 * ترجمه‌ی انگلیسی صفحه‌ها و خدماتی که با seed-home ساخته شده‌اند (home, about, privacy و دو خدمت)
 * اجرا: npm run translate:en
 * فقط متن‌هایی که در فهرست زیر هستند ترجمه می‌شوند و فقط اگر نسخه‌ی انگلیسی هنوز خالی باشد
 * (اگر در پنل انگلیسی را دستی نوشته باشید، دست نمی‌خورد). بعد از ترجمه «نمایش در انگلیسی» روشن می‌شود.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const EN: Record<string, string> = {
  // صفحه‌ها
  'صفحه اصلی': 'Home',
  'درباره ما': 'About us',
  'سیاست حفظ حریم خصوصی': 'Privacy policy',
  // هیرو
  'حمل‌ونقل بین‌المللی': 'International shipping',
  'پل ارتباطی شما با': 'Your bridge to',
  'تجارت سراسر جهان': 'trade around the world',
  'با تکیه بر تجربه، تخصص و شبکه حمل‌ونقل بین‌المللی، مسیر جابه‌جایی محموله‌های شما را با اطمینان مدیریت می‌کنیم.':
    'Backed by experience, expertise and an international transport network, we manage the journey of your cargo with confidence.',
  'درخواست مشاوره': 'Request a consultation',
  'مشاهده خدمات': 'Our services',
  // خدمات
  'خدمات ما': 'Our services',
  'خدمات متنوع مجموعه ما': 'Shipping services, end to end',
  'از حمل دریایی و جاده‌ای تا انبارداری و بسته‌بندی؛ خدمات حمل‌ونقل را متناسب با نیاز محموله شما ارائه می‌کنیم.':
    'From sea and road freight to storage and packing, we shape our services around what your cargo needs.',
  'حمل و نقل دریایی': 'Sea freight',
  'حمل ترکیبی دریایی و جاده‌ای': 'Combined sea and road freight',
  'حمل محموله‌های کانتینری، فله و خودرو از بنادر آبادان و خرمشهر به عراق، کویت و امارات.':
    'Container, bulk and vehicle shipments from the ports of Abadan and Khorramshahr to Iraq, Kuwait and the UAE.',
  'جابه‌جایی محموله از مبدأ تا مقصد نهایی با ترکیب حمل دریایی و جاده‌ای.':
    'Door-to-door delivery that combines sea and road transport, from origin to final destination.',
  // درباره ما
  'شاهین مارین': 'Shahin Marine',
  'حمل‌ونقل مطمئن محموله شما از مبدأ تا مقصد': 'Reliable shipping for your cargo, from origin to destination',
  'شاهین مارین خدمات حمل‌ونقل دریایی و جاده‌ای را برای افراد و شرکت‌ها ارائه می‌کند. برای دریافت مشاوره و استعلام قیمت، با ما تماس بگیرید یا درخواست خود را ثبت کنید.':
    'Shahin Marine provides sea and road freight services for individuals and companies. For advice or a quote, contact us or submit a request.',
  'اطلاعات بیشتر': 'Learn more',
  // مسیرها
  'مسیرها': 'Routes',
  'از بنادر آبادان و خرمشهر': 'From the ports of Abadan and Khorramshahr',
  'آبادان': 'Abadan',
  'ام‌القصر (عراق)': 'Umm Qasr (Iraq)',
  'بصره (عراق)': 'Basra (Iraq)',
  'کویت': 'Kuwait',
  'دبی (امارات)': 'Dubai (UAE)',
  // کشتی‌ها و فراخوان
  'فروش کشتی': 'Vessel sales',
  'کشتی‌های فروشی': 'Vessels for sale',
  'امروز در مورد نیازهای حمل خود با ما صحبت کنید.': 'Talk to us about your shipping needs today.',
  'کارشناسان ما برای مشاوره و استعلام قیمت آماده‌اند.': 'Our team is ready to advise you and prepare a quote.',
  'تماس با ما': 'Contact us',
  'برای همکاری با ما تماس بگیرید.': 'Get in touch to work with us.',
  // حریم خصوصی
  'شرکت حمل و نقل دریایی شاهین مارین به حریم خصوصی کاربران احترام می‌گذارد. این صفحه توضیح می‌دهد چه اطلاعاتی هنگام استفاده از وب‌سایت جمع‌آوری می‌شود و چگونه از آن استفاده می‌کنیم.':
    'Shahin Marine respects the privacy of its users. This page explains what information is collected when you use this website and how we use it.',
  'اطلاعاتی که جمع‌آوری می‌کنیم': 'Information we collect',
  'هنگام ثبت درخواست قیمت یا تماس با ما، اطلاعاتی مانند نام، شماره تماس، ایمیل و جزئیات محموله (مبدأ، مقصد، نوع و وزن کالا) را از شما دریافت می‌کنیم. همچنین اطلاعات فنی عمومی مانند نوع مرورگر و صفحات بازدیدشده ممکن است برای بهبود عملکرد سایت ثبت شود.':
    'When you request a quote or contact us, we receive details such as your name, phone number, email and cargo details (origin, destination, type and weight of goods). General technical data, such as browser type and pages visited, may also be recorded to improve the website.',
  'نحوهٔ استفاده از اطلاعات': 'How we use information',
  'بررسی درخواست و ارائهٔ قیمت و پاسخ به پرسش‌های شما': 'Reviewing your request, preparing a quote and answering your questions',
  'پیگیری وضعیت محموله‌ها': 'Tracking the status of shipments',
  'بهبود کیفیت خدمات و وب‌سایت': 'Improving our services and website',
  'اشتراک‌گذاری اطلاعات': 'Sharing information',
  'اطلاعات شما به اشخاص ثالث فروخته نمی‌شود. تنها در صورتی که برای انجام خدمت لازم باشد (مانند هماهنگی با بندر، گمرک یا شرکای حمل) و در حد ضرورت با آنان به اشتراک گذاشته می‌شود.':
    'Your information is never sold to third parties. It is shared only when needed to deliver the service (for example with ports, customs or transport partners), and only as much as necessary.',
  'نگهداری و امنیت': 'Storage and security',
  'تلاش می‌کنیم اطلاعات شما را با روش‌های متعارف امنیتی محافظت کنیم و فقط تا زمانی که برای ارائهٔ خدمات لازم است نگهداری کنیم.':
    'We protect your information with standard security measures and keep it only as long as needed to provide our services.',
  'کوکی‌ها': 'Cookies',
  'این وب‌سایت از کوکی‌های ضروری و ابزارهای کش و ترجمه برای عملکرد صحیح استفاده می‌کند. می‌توانید کوکی‌ها را از تنظیمات مرورگر خود مدیریت کنید.':
    'This website uses essential cookies to work correctly. You can manage cookies in your browser settings.',
  'برای هر پرسش دربارهٔ حریم خصوصی یا درخواست حذف اطلاعات خود، از طریق صفحهٔ «تماس با ما» با ما در ارتباط باشید.':
    'For any privacy question or to ask for your data to be deleted, please reach us through the Contact page.',
}

const missing = new Set<string>()
// پیمایش داده: متن‌های فارسی ترجمه می‌شوند؛ جهت متن ویرایشگر به چپ‌به‌راست تغییر می‌کند
function tr(v: unknown, key = ''): unknown {
  if (typeof v === 'string') {
    if (!/[؀-ۿ]/.test(v) || key === 'slug' || key === 'href') return v
    const out = EN[v.trim()]
    if (!out) missing.add(v)
    return out ?? v
  }
  if (Array.isArray(v)) return v.map((x) => tr(x, key))
  if (v && typeof v === 'object') {
    const o: Record<string, unknown> = {}
    for (const [k, x] of Object.entries(v)) o[k] = k === 'direction' && x === 'rtl' ? 'ltr' : tr(x, k)
    return o
  }
  return v
}

const SKIP = new Set(['id', 'createdAt', 'updatedAt', 'slug', 'image', 'video', 'services', 'icon', 'order', 'isActive'])
const pick = (d: Record<string, unknown>, keys: string[]) => Object.fromEntries(keys.filter((k) => k in d).map((k) => [k, d[k]]))

const payload = await getPayload({ config })

for (const slug of ['home', 'about', 'privacy']) {
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, locale: 'fa', depth: 0, limit: 1 })
  const fa = docs[0]
  if (!fa) {
    console.log(`page "${slug}" not found, skipped`)
    continue
  }
  const en = await payload.findByID({ collection: 'pages', id: fa.id, locale: 'en', fallbackLocale: false, depth: 0 })
  if (en.title) {
    console.log(`page "${slug}" already has English, skipped`)
    continue
  }
  await payload.update({
    collection: 'pages',
    id: fa.id,
    locale: 'en',
    data: { title: tr(fa.title) as string, layout: tr(fa.layout) as typeof fa.layout, showInEnglish: true },
  })
  console.log(`page "${slug}" translated`)
}

const services = await payload.find({ collection: 'services', locale: 'fa', depth: 0, limit: 50 })
for (const s of services.docs) {
  const en = await payload.findByID({ collection: 'services', id: s.id, locale: 'en', fallbackLocale: false, depth: 0 })
  if (en.title) {
    console.log(`service "${s.slug}" already has English, skipped`)
    continue
  }
  const data = tr(pick(s as unknown as Record<string, unknown>, Object.keys(s).filter((k) => !SKIP.has(k) && k !== 'seo'))) as Record<string, unknown>
  await payload.update({ collection: 'services', id: s.id, locale: 'en', data })
  console.log(`service "${s.slug}" translated`)
}

if (missing.size) console.log('NOT TRANSLATED (left in Persian):\n' + [...missing].join('\n'))
process.exit(0)
