import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { HeroVideo } from './HeroVideo'
import type { Media } from '@/payload-types'

type LinkData = { label?: string | null; href?: string | null } | null | undefined

export type HeroProps = {
  eyebrow?: string | null
  title: string
  titleAccent?: string | null
  text?: string | null
  image?: number | Media | null
  video?: number | Media | null
  primary?: LinkData
  secondary?: LinkData
  showTracking?: boolean | null
}

// هیروی سینمایی تمام‌صفحه: ویدیو یا عکس از لبه تا لبه با زوم آرام دوربین،
// تیتر بسیار بزرگ در پایین صفحه، کمترین رابط کاربری (یک دکمه، یک لینک، کادر کوچک رهگیری) و نوار بنادر.
// بدون گرادیان: فقط یک لایه‌ی تیره‌ی یکنواخت روی تصویر برای خوانایی متن.
export async function Hero({ eyebrow, title, titleAccent, text, image, video, primary, secondary, showTracking = true }: HeroProps) {
  const locale = await getLocale()
  const t = await getTranslations()
  const ports = t.raw('ports') as string[]
  const img = image && typeof image !== 'number' ? image : null
  const vid = video && typeof video !== 'number' && video.url ? video : null
  const arrow = locale === 'fa' ? '←' : '→'

  return (
    <section className="relative isolate flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-navy text-white">
      {/* تصویر و ویدیو */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="kenburns absolute inset-0">
          {img ? (
            <CmsImage media={img} size="hero" fill priority sizes="100vw" />
          ) : (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.webp')" }} />
          )}
        </div>
        {vid && <HeroVideo src={vid.url!} type={vid.mimeType || 'video/mp4'} />}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Container className="flex flex-1 flex-col justify-end pb-10 pt-32 lg:pb-14">
        {eyebrow && (
          <p className="rise mb-6 flex items-center gap-4 text-xs font-semibold tracking-[0.25em] text-white/75">
            <span className="h-px w-12 bg-white/60" aria-hidden />
            {eyebrow}
          </p>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <h1
            style={{ ['--d' as string]: '0.1s' }}
            className="rise text-[3rem] font-black leading-[1.08] tracking-tight sm:text-7xl lg:col-span-9 lg:text-[7.2rem]"
          >
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="text-white/55">{titleAccent}</span>
              </>
            )}
          </h1>

          <div style={{ ['--d' as string]: '0.35s' }} className="rise lg:col-span-3 lg:pb-4">
            {text && <p className="text-sm leading-7 text-white/75 sm:text-base sm:leading-8">{text}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {primary?.label && (
                <Button href={primary.href || '/quote'} size="lg" variant="sky">
                  {primary.label}
                  <span aria-hidden>{arrow}</span>
                </Button>
              )}
              {secondary?.label && (
                <Button href={secondary.href || '/services'} variant="ghost" className="!text-white">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* کادر کوچک رهگیری */}
        {showTracking && (
          <form
            action={`/${locale}/tracking`}
            method="get"
            style={{ ['--d' as string]: '0.5s' }}
            className="rise mt-10 flex w-full max-w-md items-center gap-2 rounded-full border border-white/25 bg-black/30 p-1.5 ps-5 backdrop-blur-md"
          >
            <label htmlFor="quick-track" className="shrink-0 text-xs text-white/70">
              {t('home.trackTitle')}
            </label>
            <input
              id="quick-track"
              name="code"
              required
              minLength={6}
              maxLength={6}
              autoComplete="off"
              dir="ltr"
              placeholder="123456"
              aria-label={t('home.trackHint')}
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-center font-mono tracking-[0.3em] text-white placeholder:text-white/35 focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-primary hover:text-white">
              {t('home.trackButton')}
            </button>
          </form>
        )}
      </Container>

      {/* نوار بنادر */}
      <div dir="ltr" className="overflow-hidden border-t border-white/15 py-4 text-sm text-white/60" aria-hidden>
        <div className="ticker-track flex w-max gap-14 whitespace-nowrap">
          {[...ports, ...ports, ...ports, ...ports].map((p, i) => (
            <span key={i} className="flex items-center gap-14">
              {p}
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
