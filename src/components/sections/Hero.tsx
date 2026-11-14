import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { RevealWords, Reveal } from '@/components/motion/Reveal'
import { HeroVideo } from './HeroVideo'
import { Globe } from '@/components/three/Globe'
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

// هیروی آینده‌نگر: زمینه‌ی شفق به رنگ تم، تیتر بزرگ با گرادیان، کره‌ی سه‌بعدی مسیرها، کادر رهگیری شیشه‌ای
export async function Hero({ eyebrow, title, titleAccent, text, video, primary, secondary, showTracking = true }: HeroProps) {
  const locale = await getLocale()
  const t = await getTranslations()
  const ports = t.raw('ports') as string[]
  const vid = video && typeof video !== 'number' && video.url ? video : null

  return (
    <section className="aurora grain relative isolate flex min-h-[100svh] flex-col overflow-hidden text-foam">
      <div className="chart-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      {/* ویدیو (اگر در پنل گذاشته شده) کم‌رنگ پشت همه‌چیز */}
      {vid && (
        <div className="absolute inset-0 -z-20 opacity-25" aria-hidden>
          <HeroVideo src={vid.url!} type={vid.mimeType || 'video/mp4'} />
        </div>
      )}

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-5 pb-10 pt-32 lg:grid-cols-12 lg:pt-28">
        <div className="lg:col-span-6">
          {eyebrow && (
            <Reveal>
              <p className="glass-dark mb-8 inline-flex items-center gap-3 rounded-full px-4 py-1.5 text-xs tracking-wide text-foam/80">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {eyebrow}
              </p>
            </Reveal>
          )}
          <RevealWords as="h1" text={title} className="text-[2.5rem] font-black leading-[1.2] sm:text-6xl lg:text-[4.6rem]" />
          {titleAccent && (
            <Reveal delay={0.25}>
              <p className="text-grad mt-1 pb-2 text-[2.5rem] font-black leading-[1.25] sm:text-6xl lg:text-[4.6rem]">{titleAccent}</p>
            </Reveal>
          )}
          {text && (
            <Reveal delay={0.45}>
              <p className="mt-6 max-w-xl text-base leading-8 text-foam/70 sm:text-lg">{text}</p>
            </Reveal>
          )}
          {(primary?.label || secondary?.label) && (
            <Reveal delay={0.6}>
              <div className="mt-9 flex flex-wrap gap-3">
                {primary?.label && (
                  <Button href={primary.href || '/quote'} size="lg" variant="accent">
                    {primary.label}
                  </Button>
                )}
                {secondary?.label && (
                  <Button href={secondary.href || '/services'} size="lg" variant="outlineLight">
                    {secondary.label}
                  </Button>
                )}
              </div>
            </Reveal>
          )}

          {showTracking && (
            <Reveal delay={0.75}>
              <form action={`/${locale}/tracking`} method="get" className="glass-dark mt-10 max-w-md rounded-3xl p-5">
                <label htmlFor="quick-track" className="block text-sm font-semibold">
                  {t('home.trackTitle')}
                </label>
                <div className="mt-3 flex gap-2">
                  <input
                    id="quick-track"
                    name="code"
                    required
                    minLength={6}
                    maxLength={6}
                    autoComplete="off"
                    dir="ltr"
                    placeholder="123456"
                    aria-describedby="quick-track-hint"
                    className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-center font-mono text-lg tracking-[0.35em] text-foam placeholder:text-foam/25 focus:border-primary focus:outline-none"
                  />
                  <button type="submit" className="glow rounded-2xl bg-primary px-5 text-sm font-bold text-navy transition hover:brightness-110">
                    {t('home.trackButton')}
                  </button>
                </div>
                <p id="quick-track-hint" className="mt-2 text-xs text-foam/50">
                  {t('home.trackHint')}
                </p>
              </form>
            </Reveal>
          )}
        </div>

        <div className="relative lg:col-span-6">
          <Globe names={ports} rtl={locale === 'fa'} />
        </div>
      </div>

      {/* پایین هیرو: مختصات + نوار بنادر */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-5 text-[11px] tracking-[0.25em] text-foam/45">
        <span className="display ltr-nums">30°20′N · 48°17′E</span>
        <span className="relative hidden h-10 w-px overflow-hidden bg-foam/15 sm:block" aria-hidden>
          <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-primary" />
        </span>
        <span>{t('home.coords').split('·')[0]}</span>
      </div>
      <div className="relative overflow-hidden border-t border-white/10 py-4 text-sm text-foam/55" aria-hidden>
        <div className="ticker-track flex w-max gap-14 whitespace-nowrap">
          {[...ports, ...ports, ...ports, ...ports].map((p, i) => (
            <span key={i} className="flex items-center gap-14">
              {p}
              <span className="h-1 w-1 rounded-full bg-primary" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
