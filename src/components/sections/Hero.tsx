import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { RevealWords, Reveal } from '@/components/motion/Reveal'
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

// هیروی تمام‌صفحه: ویدیو (یا عکس با حرکت آرام)، تیتر بزرگ کلمه‌به‌کلمه، دو دکمه، کادر رهگیری شیشه‌ای، نوار بنادر
export async function Hero({ eyebrow, title, titleAccent, text, image, video, primary, secondary, showTracking = true }: HeroProps) {
  const locale = await getLocale()
  const t = await getTranslations()
  const ports = t.raw('ports') as string[]
  const img = image && typeof image !== 'number' ? image : null
  const vid = video && typeof video !== 'number' && video.url ? video : null

  return (
    <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy text-foam">
      {/* پس‌زمینه: ویدیو روی عکس؛ عکس تا بارگذاری ویدیو (و برای کاهش حرکت) دیده می‌شود */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        {img ? (
          <div className="kenburns absolute inset-0">
            <CmsImage media={img} size="hero" fill priority sizes="100vw" />
          </div>
        ) : (
          <div className="kenburns absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.webp')" }} />
        )}
        {vid && <HeroVideo src={vid.url!} type={vid.mimeType || 'video/mp4'} />}
        {/* سایه‌ها برای خوانایی متن روی تصویر */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-l from-navy/80 via-transparent to-transparent rtl:bg-gradient-to-r" />
      </div>

      <div className="mx-auto grid grid-cols-1 w-full max-w-7xl flex-1 items-end gap-12 px-5 pb-16 pt-36 lg:grid-cols-12 lg:pb-24">
        <div className="lg:col-span-8">
          {eyebrow && (
            <Reveal>
              <p className="mb-8 inline-flex items-center gap-4 text-sm tracking-wide text-foam/70">
                <span className="h-px w-12 bg-accent" aria-hidden />
                {eyebrow}
              </p>
            </Reveal>
          )}
          <RevealWords as="h1" text={title} className="text-[2.6rem] font-black leading-[1.2] sm:text-6xl lg:text-[5.2rem]" />
          {titleAccent && (
            <RevealWords
              as="p"
              text={titleAccent}
              delay={0.25}
              className="mt-2 text-[2.6rem] font-extralight leading-[1.2] text-foam/80 sm:text-6xl lg:text-[5.2rem]"
            />
          )}
          {text && (
            <Reveal delay={0.5}>
              <p className="mt-8 max-w-xl text-base leading-8 text-foam/70 sm:text-lg">{text}</p>
            </Reveal>
          )}
          {(primary?.label || secondary?.label) && (
            <Reveal delay={0.65}>
              <div className="mt-10 flex flex-wrap gap-3">
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
        </div>

        {showTracking && (
          <Reveal delay={0.8} className="lg:col-span-4">
            <form
              action={`/${locale}/tracking`}
              method="get"
              className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl"
            >
              <label htmlFor="quick-track" className="block text-sm font-semibold">
                {t('home.trackTitle')}
              </label>
              <p className="mt-1 text-xs text-foam/60">{t('home.trackHint')}</p>
              <div className="mt-5 flex gap-2">
                <input
                  id="quick-track"
                  name="code"
                  required
                  minLength={6}
                  maxLength={6}
                  autoComplete="off"
                  dir="ltr"
                  placeholder="123456"
                  className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-center font-mono text-lg tracking-[0.35em] text-foam placeholder:text-foam/25 focus:border-accent focus:outline-none"
                />
                <button type="submit" className="rounded-2xl bg-foam px-5 text-sm font-bold text-navy transition hover:bg-accent hover:text-white">
                  {t('home.trackButton')}
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>

      {/* پایین هیرو: مختصات آبادان + نشانگر اسکرول + نوار بنادر */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-6 text-[11px] tracking-[0.25em] text-foam/45">
        <span className="display ltr-nums">30°20′N · 48°17′E</span>
        <span className="relative hidden h-10 w-px overflow-hidden bg-foam/15 sm:block" aria-hidden>
          <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-foam/70" />
        </span>
        <span>{t('home.coords').split('·')[0]}</span>
      </div>
      <div className="relative overflow-hidden border-t border-white/10 py-4 text-sm text-foam/55" aria-hidden>
        <div className="ticker-track flex w-max gap-14 whitespace-nowrap">
          {[...ports, ...ports, ...ports, ...ports].map((p, i) => (
            <span key={i} className="flex items-center gap-14">
              {p}
              <span className="h-1 w-1 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
