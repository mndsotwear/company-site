/**
 * ساخت صفحه‌ی اصلی (home)، درباره ما (about)، حریم خصوصی (privacy) و دو خدمت اولیه با متن‌های سایت فعلی shahinmarine.com
 * اجرا: npm run seed:home
 * اگر صفحه یا خدمت از قبل وجود داشته باشد، دست نمی‌خورد.
 * آمار و کارت‌های صنایع عمداً ساخته نمی‌شوند (عدد و متن واقعی را کارفرما می‌دهد).
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const para = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'rtl' as const,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'rtl',
        textFormat: 0,
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      },
    ],
  },
})


// ---- سازنده‌های ساده‌ی متن ویرایشگر (Lexical) ----
const textNode = (text: string) => ({ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })
const base = { format: '', indent: 0, version: 1, direction: 'rtl' }
const P = (text: string) => ({ ...base, type: 'paragraph', textFormat: 0, children: [textNode(text)] })
const H2 = (text: string) => ({ ...base, type: 'heading', tag: 'h2', children: [textNode(text)] })
const UL = (items: string[]) => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: [textNode(t)] })),
})
type LexNode = { type: string; version: number; [k: string]: unknown }
const doc = (...children: LexNode[]) => ({
  root: { type: 'root', format: '' as const, indent: 0, version: 1, direction: 'rtl' as const, children },
})

const payload = await getPayload({ config })

// ---- خدمات ----
const SERVICES = [
  {
    slug: 'sea-freight',
    title: 'حمل و نقل دریایی',
    icon: 'ship' as const,
    order: 1,
    summary: 'حمل محموله‌های کانتینری، فله و خودرو از بنادر آبادان و خرمشهر به عراق، کویت و امارات.',
  },
  {
    slug: 'sea-road',
    title: 'حمل ترکیبی دریایی و جاده‌ای',
    icon: 'truck' as const,
    order: 2,
    summary: 'جابه‌جایی محموله از مبدأ تا مقصد نهایی با ترکیب حمل دریایی و جاده‌ای.',
  },
]

for (const s of SERVICES) {
  const exists = await payload.count({ collection: 'services', where: { slug: { equals: s.slug } } })
  if (exists.totalDocs) {
    console.log(`service "${s.slug}" exists, skipped`)
    continue
  }
  await payload.create({ collection: 'services', locale: 'fa', data: { ...s, isActive: true } })
  console.log(`service "${s.slug}" created`)
}

// ---- صفحه اصلی ----
const home = await payload.count({ collection: 'pages', where: { slug: { equals: 'home' } } })
if (home.totalDocs) {
  console.log('page "home" exists, skipped')
} else {
  await payload.create({
    collection: 'pages',
    locale: 'fa',
    data: {
      title: 'صفحه اصلی',
      slug: 'home',
      showInEnglish: false,
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'حمل‌ونقل بین‌المللی',
          title: 'پل ارتباطی شما با',
          titleAccent: 'تجارت سراسر جهان',
          text: 'با تکیه بر تجربه، تخصص و شبکه حمل‌ونقل بین‌المللی، مسیر جابه‌جایی محموله‌های شما را با اطمینان مدیریت می‌کنیم.',
          primary: { label: 'درخواست مشاوره', href: '/quote' },
          secondary: { label: 'مشاهده خدمات', href: '/services' },
          showTracking: true,
        },
        {
          blockType: 'services',
          eyebrow: 'خدمات ما',
          heading: 'خدمات متنوع مجموعه ما',
          intro: 'از حمل دریایی و جاده‌ای تا انبارداری و بسته‌بندی؛ خدمات حمل‌ونقل را متناسب با نیاز محموله شما ارائه می‌کنیم.',
        },
        {
          blockType: 'about',
          eyebrow: 'درباره ما',
          heading: 'حمل‌ونقل مطمئن محموله شما از مبدأ تا مقصد',
          body: para(
            'شاهین مارین خدمات حمل‌ونقل دریایی و جاده‌ای را برای افراد و شرکت‌ها ارائه می‌کند. برای دریافت مشاوره و استعلام قیمت، با ما تماس بگیرید یا درخواست خود را ثبت کنید.',
          ),
          link: { label: 'اطلاعات بیشتر', href: '/about' },
        },
        {
          blockType: 'routes',
          eyebrow: 'مسیرها',
          heading: 'از بنادر آبادان و خرمشهر',
          routes: [
            { from: 'آبادان', to: 'ام‌القصر (عراق)' },
            { from: 'آبادان', to: 'بصره (عراق)' },
            { from: 'آبادان', to: 'کویت' },
            { from: 'آبادان', to: 'دبی (امارات)' },
          ],
        },
        { blockType: 'featuredVessels', eyebrow: 'فروش کشتی', heading: 'کشتی‌های فروشی', limit: 3 },
        {
          blockType: 'cta',
          heading: 'امروز در مورد نیازهای حمل خود با ما صحبت کنید.',
          text: 'کارشناسان ما برای مشاوره و استعلام قیمت آماده‌اند.',
          link: { label: 'تماس با ما', href: '/contact' },
        },
      ],
    },
  })
  console.log('page "home" created')
}

// ---- درباره ما ----
const about = await payload.count({ collection: 'pages', where: { slug: { equals: 'about' } } })
if (about.totalDocs) {
  console.log('page "about" exists, skipped')
} else {
  await payload.create({
    collection: 'pages',
    locale: 'fa',
    data: {
      title: 'درباره ما',
      slug: 'about',
      showInEnglish: false,
      layout: [
        {
          blockType: 'about',
          eyebrow: 'شاهین مارین',
          heading: 'حمل‌ونقل مطمئن محموله شما از مبدأ تا مقصد',
          body: para(
            'شاهین مارین خدمات حمل‌ونقل دریایی و جاده‌ای را برای افراد و شرکت‌ها ارائه می‌کند. برای دریافت مشاوره و استعلام قیمت، با ما تماس بگیرید یا درخواست خود را ثبت کنید.',
          ),
        },
        {
          blockType: 'routes',
          eyebrow: 'مسیرها',
          heading: 'از بنادر آبادان و خرمشهر',
          routes: [
            { from: 'آبادان', to: 'ام‌القصر (عراق)' },
            { from: 'آبادان', to: 'بصره (عراق)' },
            { from: 'آبادان', to: 'کویت' },
            { from: 'آبادان', to: 'دبی (امارات)' },
          ],
        },
        {
          blockType: 'cta',
          heading: 'برای همکاری با ما تماس بگیرید.',
          link: { label: 'تماس با ما', href: '/contact' },
        },
      ],
    },
  })
  console.log('page "about" created')
}

// ---- حریم خصوصی (متن سایت فعلی) ----
const privacy = await payload.count({ collection: 'pages', where: { slug: { equals: 'privacy' } } })
if (privacy.totalDocs) {
  console.log('page "privacy" exists, skipped')
} else {
  await payload.create({
    collection: 'pages',
    locale: 'fa',
    data: {
      title: 'سیاست حفظ حریم خصوصی',
      slug: 'privacy',
      showInEnglish: false,
      layout: [
        {
          blockType: 'richText',
          content: doc(
            P('شرکت حمل و نقل دریایی شاهین مارین به حریم خصوصی کاربران احترام می‌گذارد. این صفحه توضیح می‌دهد چه اطلاعاتی هنگام استفاده از وب‌سایت جمع‌آوری می‌شود و چگونه از آن استفاده می‌کنیم.'),
            H2('اطلاعاتی که جمع‌آوری می‌کنیم'),
            P('هنگام ثبت درخواست قیمت یا تماس با ما، اطلاعاتی مانند نام، شماره تماس، ایمیل و جزئیات محموله (مبدأ، مقصد، نوع و وزن کالا) را از شما دریافت می‌کنیم. همچنین اطلاعات فنی عمومی مانند نوع مرورگر و صفحات بازدیدشده ممکن است برای بهبود عملکرد سایت ثبت شود.'),
            H2('نحوهٔ استفاده از اطلاعات'),
            UL([
              'بررسی درخواست و ارائهٔ قیمت و پاسخ به پرسش‌های شما',
              'پیگیری وضعیت محموله‌ها',
              'بهبود کیفیت خدمات و وب‌سایت',
            ]),
            H2('اشتراک‌گذاری اطلاعات'),
            P('اطلاعات شما به اشخاص ثالث فروخته نمی‌شود. تنها در صورتی که برای انجام خدمت لازم باشد (مانند هماهنگی با بندر، گمرک یا شرکای حمل) و در حد ضرورت با آنان به اشتراک گذاشته می‌شود.'),
            H2('نگهداری و امنیت'),
            P('تلاش می‌کنیم اطلاعات شما را با روش‌های متعارف امنیتی محافظت کنیم و فقط تا زمانی که برای ارائهٔ خدمات لازم است نگهداری کنیم.'),
            H2('کوکی‌ها'),
            P('این وب‌سایت از کوکی‌های ضروری و ابزارهای کش و ترجمه برای عملکرد صحیح استفاده می‌کند. می‌توانید کوکی‌ها را از تنظیمات مرورگر خود مدیریت کنید.'),
            H2('تماس با ما'),
            P('برای هر پرسش دربارهٔ حریم خصوصی یا درخواست حذف اطلاعات خود، از طریق صفحهٔ «تماس با ما» با ما در ارتباط باشید.'),
          ),
        },
      ],
    },
  })
  console.log('page "privacy" created')
}

process.exit(0)
