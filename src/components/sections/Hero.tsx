import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { HeroVideo } from './HeroVideo'
import { HeroTools, type OfficeLite } from './HeroTools'
import { getOffices } from '@/lib/operations'
import type { Locale } from '@/lib/payload'
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

// هیرو (الهام از ONE): عکس یا ویدیوی تمام‌عرض، تیتر بزرگ در یک طرف و کارت ابزار در طرف دیگر
// (رهگیری، برنامه حرکت، دفاتر، استعلام قیمت). رنگ‌ها تخت‌اند؛ فقط یک لایه‌ی تیره‌ی یکنواخت روی تصویر.
export async function Hero({ eyebrow, title, titleAccent, text, image, video, primary, secondary }: HeroProps) {
  const locale = await getLocale()
  const t = await getTranslations()
  const ports = t.raw('ports') as string[]
  const img = image && typeof image !== 'number' ? image : null
  const vid = video && typeof video !== 'number' && video.url ? video : null
  const offices: OfficeLite[] = (await getOffices(locale as Locale)).map((o) => ({
    id: o.id,
    name: o.name,
    city: o.city,
    phone: o.phone,
    hours: o.hours,
    mapUrl: o.mapUrl,
  }))

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="kenburns absolute inset-0">
          {img ? (
            <CmsImage media={img} size="hero" fill priority sizes="100vw" />
          ) : (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.webp')" }} />
          )}
        </div>
        {vid && <HeroVideo src={vid.url!} type={vid.mimeType || 'video/mp4'} />}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <Container className="flex flex-1 flex-col justify-end pb-8 pt-36 lg:pt-44">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="rise mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-white/80">
              <span className="h-px w-10 bg-white/60" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1 style={{ ['--d' as string]: '0.08s' }} className="rise text-[2.6rem] font-black leading-[1.15] tracking-tight sm:text-6xl lg:text-[4.8rem]">
            {title}
            {titleAccent && (
              <>
                <br />
                {titleAccent}
              </>
            )}
          </h1>
          {text && (
            <p style={{ ['--d' as string]: '0.25s' }} className="rise mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
              {text}
            </p>
          )}
          {(primary?.label || secondary?.label) && (
            <div style={{ ['--d' as string]: '0.35s' }} className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {primary?.label && (
                <Button href={primary.href || '/quote'} size="lg" variant="sky">
                  {primary.label}
                </Button>
              )}
              {secondary?.label && (
                <Button href={secondary.href || '/services'} variant="ghost" className="!text-white">
                  {secondary.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* نوار ابزار شیشه‌ای پایین تصویر */}
        <div style={{ ['--d' as string]: '0.45s' }} className="rise mt-12 max-w-4xl">
          <HeroTools offices={offices} />
        </div>
      </Container>

      {/* نوار بنادر */}
      <div dir="ltr" className="overflow-hidden border-t border-white/15 bg-black/25 py-3.5 text-sm text-white/70" aria-hidden>
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
