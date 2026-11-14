import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

// صفحه‌ی ۴۰۴ اختصاصی: «کشتی گم‌شده» روی نقشه‌ی دریایی، خارج از مسیر نقطه‌چین
export default async function NotFound() {
  const t = await getTranslations()
  return (
    <section className="relative overflow-hidden bg-navy text-foam">
      <Container className="relative grid min-h-[90vh] items-center gap-12 pb-20 pt-36 lg:grid-cols-2">
        <div>
          <p className="text-sm tracking-widest text-sky">{t('notFound.code')}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.4] sm:text-5xl">{t('notFound.title')}</h1>
          <p className="mt-6 max-w-md leading-8 text-foam/70">{t('notFound.text')}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/" variant="sky" size="lg">
              {t('notFound.home')}
            </Button>
            <Button href="/tracking" variant="outlineLight" size="lg">
              {t('nav.tracking')}
            </Button>
          </div>
          <p className="mt-14 text-xs tracking-wide text-foam/40">{t('notFound.coords')}</p>
        </div>

        {/* مسیر نقطه‌چین که وسط راه قطع می‌شود و کشتی بیرون از مسیر */}
        <svg viewBox="0 0 400 300" className="mx-auto w-full max-w-md" fill="none" aria-hidden>
          <circle cx="60" cy="230" r="6" fill="currentColor" className="text-sky" />
          <text x="60" y="262" textAnchor="middle" fontSize="13" fill="currentColor" className="text-foam/50">
            {t('notFound.from')}
          </text>
          <path d="M60 230 C 120 200, 150 170, 200 150" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" className="text-sky/70" />
          <path d="M200 150 C 240 135, 270 120, 300 110" stroke="currentColor" strokeWidth="2" strokeDasharray="2 10" className="text-foam/20" />
          <text x="318" y="98" fontSize="22" fill="currentColor" className="text-foam/30">
            ?
          </text>
          <g transform="translate(232 62) rotate(-14)" className="text-foam" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
            <path d="M0 30h64l-8 14a5 5 0 0 1-4 2H12a5 5 0 0 1-4-2L0 30Z" />
            <path d="M10 30V18h44v12" />
            <path d="M22 18V8h14v10" />
            <path d="M29 8V0" />
          </g>
          <path d="M226 116c10 4 22 4 32 0M240 126c8 3 16 3 24 0" stroke="currentColor" strokeWidth="1.5" className="text-sky/40" />
        </svg>
      </Container>
    </section>
  )
}
