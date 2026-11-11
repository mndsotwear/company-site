import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/sections/PageHeader'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/forms/ContactForm'
import { getSiteSettings, whatsappLink, type Locale } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title'), description: t('intro'), alternates: { languages: { fa: '/fa/contact', en: '/en/contact' } } }
}

// تماس با ما: همه‌ی اطلاعات از «تنظیمات سایت» در پنل
export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const s = await getSiteSettings(locale as Locale)

  const phone = s.phone || '09366334228'
  const email = s.email || 'shahin.marine1@gmail.com'
  const address = s.address || t('footer.address')
  const wa = whatsappLink(s.whatsapp || phone)

  const channels = [
    { label: t('contact.phone'), value: phone, href: `tel:${phone}`, ltr: true, hint: t('contact.phoneHint') },
    ...(wa ? [{ label: t('contact.whatsapp'), value: s.whatsapp || phone, href: wa, ltr: true, hint: t('contact.whatsappHint') }] : []),
    { label: t('contact.email'), value: email, href: `mailto:${email}`, ltr: true, hint: t('contact.emailHint') },
  ]

  return (
    <>
      <PageHeader eyebrow={t('contact.eyebrow')} title={t('contact.title')} intro={t('contact.intro')} crumbs={[{ label: t('nav.contact') }]} />

      <Container className="grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
        {/* راه‌های تماس + فرم پیام */}
        <div className="lg:col-span-7">
        <ul className="divide-y divide-border border-y border-border">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group grid gap-1 py-7 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-8"
              >
                <span className="text-sm text-muted">{c.label}</span>
                <span>
                  <span className={`inline-block text-2xl font-bold transition group-hover:text-primary ${c.ltr ? 'ltr-nums' : ''}`}>
                    {c.value}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{c.hint}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
          <div className="mt-14" id="message">
            <h2 className="text-2xl font-extrabold">{t('contactForm.title')}</h2>
            <p className="mt-2 mb-8 text-muted">{t('contactForm.intro')}</p>
            <ContactForm />
          </div>
        </div>

        {/* دفتر و نقشه */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-2xl bg-navy p-8 text-foam">
            <div className="chart-grid absolute inset-0" aria-hidden />
            <div className="relative">
              <p className="text-sm text-sky">{t('contact.office')}</p>
              <p className="mt-3 text-2xl font-bold leading-10">{address}</p>
              <p className="mt-6 text-xs tracking-wide text-foam/50">{t('home.coords')}</p>
              {s.mapUrl && (
                <Button href={s.mapUrl} variant="outlineLight" className="mt-8">
                  {t('contact.map')}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border p-8">
            <p className="font-bold">{t('contact.quoteTitle')}</p>
            <p className="mt-2 text-sm leading-7 text-muted">{t('contact.quoteText')}</p>
            <Button href="/quote" variant="accent" className="mt-6">
              {t('nav.quote')}
            </Button>
          </div>
        </div>
      </Container>
    </>
  )
}
