import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { RichText } from '@/components/ui/RichText'
import { Section } from '@/components/ui/Section'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal, RevealWords } from '@/components/motion/Reveal'
import type { AboutBlock } from '@/payload-types'

// درباره ما: بدون عکس → تیتر بزرگ یک طرف، متن طرف دیگر (چیدمان مجله‌ای)
//            با عکس → عکس بلند با حرکت پارالاکس یک طرف، تیتر و متن طرف دیگر
export function AboutSection({ eyebrow, heading, body, image, link }: AboutBlock) {
  const hasImage = Boolean(image && typeof image !== 'number')

  const title = (
    <>
      {eyebrow && (
        <Reveal>
          <p className="mb-6 flex items-center gap-4 text-xs tracking-[0.2em] text-muted">
            <span className="display text-accent">۰۲</span>
            <span className="h-px w-10 bg-border" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
      )}
      {heading && <RevealWords text={heading} className="text-[2rem] font-black leading-[1.3] sm:text-5xl" />}
    </>
  )

  const text = (
    <Reveal delay={0.2}>
      <RichText data={body} className="text-lg text-muted" />
      {link?.label && (
        <div className="mt-10">
          <Button href={link.href || '/about'} variant="primary">
            {link.label}
          </Button>
        </div>
      )}
    </Reveal>
  )

  return (
    <Section>
      {hasImage ? (
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
          <Parallax className="relative aspect-[4/5] rounded-[2rem] lg:col-span-5">
            <div className="relative h-full w-full">
              <CmsImage media={image} size="card" fill sizes="(min-width:1024px) 42vw, 100vw" />
            </div>
          </Parallax>
          <div className="lg:col-span-6 lg:col-start-7">
            {title}
            <div className="mt-8">{text}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">{title}</div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-14">{text}</div>
        </div>
      )}
    </Section>
  )
}
