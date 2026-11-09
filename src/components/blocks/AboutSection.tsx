import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { RichText } from '@/components/ui/RichText'
import { Section } from '@/components/ui/Section'
import type { AboutBlock } from '@/payload-types'

// درباره ما: بدون عکس → تیتر بزرگ یک طرف، متن طرف دیگر (چیدمان مجله‌ای)
//            با عکس → عکس یک طرف، تیتر و متن طرف دیگر
export function AboutSection({ eyebrow, heading, body, image, link }: AboutBlock) {
  const hasImage = Boolean(image && typeof image !== 'number')

  const title = (
    <>
      {eyebrow && (
        <p className="mb-4 inline-flex items-center gap-3 text-sm text-primary">
          <span className="h-px w-10 bg-primary" aria-hidden />
          {eyebrow}
        </p>
      )}
      {heading && <h2 className="text-3xl font-extrabold leading-[1.45] sm:text-4xl">{heading}</h2>}
    </>
  )

  const text = (
    <>
      <RichText data={body} className="text-muted" />
      {link?.label && (
        <div className="mt-8">
          <Button href={link.href || '/about'} variant="outline">
            {link.label}
          </Button>
        </div>
      )}
    </>
  )

  return (
    <Section>
      {hasImage ? (
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <CmsImage media={image} size="card" fill sizes="(min-width:1024px) 50vw, 100vw" />
          </div>
          <div>
            {title}
            <div className="mt-6">{text}</div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">{title}</div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">{text}</div>
        </div>
      )}
    </Section>
  )
}
