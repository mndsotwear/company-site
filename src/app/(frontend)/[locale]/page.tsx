import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Button } from '@/components/ui/Button'

type Props = { params: Promise<{ locale: string }> }

// صفحه اصلی – نسخه‌ی فاز ۱ (هیرو + رهگیری سریع + نوار بنادر)
// بقیه‌ی بخش‌ها در فاز ۳ به‌صورت بلوک‌های قابل مدیریت از پنل اضافه می‌شوند
export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const tAll = await getTranslations()
  const ports = tAll.raw('ports') as string[]

  return (
    <>
      {/* ===== هیرو ===== */}
      <section className="relative overflow-hidden bg-navy text-foam">
        {/* عکس هیروی سایت فعلی را در public/images/hero.webp بگذارید */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: "url('/images/hero.webp')" }}
          aria-hidden
        />
        <div className="chart-grid absolute inset-0" aria-hidden />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-24 lg:grid-cols-12 lg:pb-28 lg:pt-32">
          <div className="lg:col-span-7">
            <p className="mb-5 inline-flex items-center gap-3 text-sm text-sky">
              <span className="h-px w-10 bg-sky" aria-hidden />
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.35] sm:text-5xl lg:text-6xl">
              {t('titleA')}
              <br />
              <span className="text-sky">{t('titleB')}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-foam/80 sm:text-lg">{t('lead')}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/quote" size="lg" variant="sky">
                {t('ctaQuote')}
              </Button>
              <Button href="/services" size="lg" variant="outlineLight">
                {t('ctaServices')}
              </Button>
            </div>

            <p className="mt-14 text-xs tracking-wide text-foam/50">{t('coords')}</p>
          </div>

          {/* ===== رهگیری سریع ===== */}
          <div className="self-end lg:col-span-5 lg:ps-8">
            <form
              action={`/${locale}/tracking`}
              method="get"
              className="rounded-2xl border border-foam/15 bg-navy/80 p-6"
            >
              <label htmlFor="quick-track" className="block font-semibold">
                {t('trackTitle')}
              </label>
              <p className="mt-1 text-sm text-foam/60">{t('trackHint')}</p>
              <div className="mt-4 flex gap-2">
                <input
                  id="quick-track"
                  name="code"
                  required
                  minLength={6}
                  maxLength={6}
                  autoComplete="off"
                  dir="ltr"
                  placeholder="123456"
                  className="min-w-0 flex-1 rounded-xl border border-foam/20 bg-transparent px-4 py-3 text-center text-lg tracking-[0.4em] text-foam placeholder:text-foam/30 focus:border-sky focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-accent px-5 font-semibold text-white transition hover:brightness-110"
                >
                  {t('trackButton')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== نوار بنادر ===== */}
        <div className="relative overflow-hidden border-t border-foam/10 py-3 text-sm text-foam/60" aria-hidden>
          <div className="ticker-track flex w-max gap-12 whitespace-nowrap">
            {[...ports, ...ports, ...ports, ...ports].map((p, i) => (
              <span key={i} className="flex items-center gap-12">
                {p}
                <span className="text-sky">⟶</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
