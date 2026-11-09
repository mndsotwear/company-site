import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import type { Media } from '@/payload-types'

type LinkData = { label?: string | null; href?: string | null } | null | undefined

export type HeroProps = {
  eyebrow?: string | null
  title: string
  titleAccent?: string | null
  text?: string | null
  image?: number | Media | null
  primary?: LinkData
  secondary?: LinkData
  showTracking?: boolean | null
}

// هیروی صفحه اصلی: عکس کشتی، تیتر دو خطی، دو دکمه، کادر رهگیری سریع، نوار بنادر
export async function Hero({ eyebrow, title, titleAccent, text, image, primary, secondary, showTracking = true }: HeroProps) {
  const locale = await getLocale()
  const t = await getTranslations()
  const ports = t.raw('ports') as string[]
  const hasCmsImage = image && typeof image !== 'number'

  return (
    <section className="relative overflow-hidden bg-navy text-foam">
      {hasCmsImage ? (
        <div className="absolute inset-0 opacity-45" aria-hidden>
          <CmsImage media={image} size="hero" fill priority />
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: "url('/images/hero.webp')" }}
          aria-hidden
        />
      )}
      <div className="chart-grid absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-24 lg:grid-cols-12 lg:pb-28 lg:pt-32">
        <div className="lg:col-span-7">
          {eyebrow && (
            <p className="mb-5 inline-flex items-center gap-3 text-sm text-sky">
              <span className="h-px w-10 bg-sky" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-extrabold leading-[1.35] sm:text-5xl lg:text-6xl">
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="text-sky">{titleAccent}</span>
              </>
            )}
          </h1>
          {text && <p className="mt-6 max-w-xl text-base leading-8 text-foam/80 sm:text-lg">{text}</p>}

          {(primary?.label || secondary?.label) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {primary?.label && (
                <Button href={primary.href || '/quote'} size="lg" variant="sky">
                  {primary.label}
                </Button>
              )}
              {secondary?.label && (
                <Button href={secondary.href || '/services'} size="lg" variant="outlineLight">
                  {secondary.label}
                </Button>
              )}
            </div>
          )}

          <p className="mt-14 text-xs tracking-wide text-foam/50">{t('home.coords')}</p>
        </div>

        {showTracking && (
          <div className="self-end lg:col-span-5 lg:ps-8">
            <form action={`/${locale}/tracking`} method="get" className="rounded-2xl border border-foam/15 bg-navy/80 p-6">
              <label htmlFor="quick-track" className="block font-semibold">
                {t('home.trackTitle')}
              </label>
              <p className="mt-1 text-sm text-foam/60">{t('home.trackHint')}</p>
              <div className="mt-4 flex gap-2">
                <input
                  id="quick-track"
                  name="code"
                  required
                  minLength={6}
                  maxLength={6}
                  inputMode="text"
                  autoComplete="off"
                  dir="ltr"
                  placeholder="123456"
                  className="min-w-0 flex-1 rounded-xl border border-foam/20 bg-transparent px-4 py-3 text-center text-lg tracking-[0.4em] text-foam placeholder:text-foam/30 focus:border-sky focus:outline-none"
                />
                <button type="submit" className="rounded-xl bg-accent px-5 font-semibold text-white transition hover:brightness-110">
                  {t('home.trackButton')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

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
  )
}
