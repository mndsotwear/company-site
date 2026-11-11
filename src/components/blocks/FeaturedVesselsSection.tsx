import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { VesselCard } from '@/components/vessels/VesselCard'
import { Reveal } from '@/components/motion/Reveal'
import { getPayloadClient, type Locale } from '@/lib/payload'
import type { FeaturedVesselsBlock } from '@/payload-types'

// کشتی‌های منتخب برای صفحه اصلی (اگر کشتی منتخبی نباشد، بخش نمایش داده نمی‌شود)
export async function FeaturedVesselsSection({ eyebrow, heading, limit }: FeaturedVesselsBlock) {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('common')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'vessels',
    locale,
    where: { featured: { equals: true }, status: { not_equals: 'sold' } },
    limit: limit || 3,
    depth: 1,
  })
  if (!docs.length) return null

  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={heading} index="۰۴" />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((v, i) => (
          <Reveal as="li" key={v.id} delay={i * 0.1}>
            <VesselCard vessel={v} locale={locale} />
          </Reveal>
        ))}
      </ul>
      <div className="mt-14">
        <Link href="/fleet" className="link-line pb-1 text-lg font-semibold">
          {t('allVessels')} {t('arrow')}
        </Link>
      </div>
    </Section>
  )
}
