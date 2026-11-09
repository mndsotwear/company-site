import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { PageHeader } from '@/components/sections/PageHeader'
import { getPageBySlug, pageMetadata } from '@/lib/pages'
import type { Locale } from '@/lib/payload'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  return pageMetadata(await getPageBySlug(slug, locale as Locale), `/${slug}`)
}

// هر صفحه‌ای که در پنل ساخته شود (مثل about یا privacy) با آدرس خودش نمایش داده می‌شود.
// صفحات ثابت (خدمات، کشتی‌ها، تماس، ...) پوشه‌ی خودشان را دارند و اولویت با آن‌هاست.
export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  if (slug === 'home') redirect(`/${locale}`)

  const page = await getPageBySlug(slug, locale as Locale)
  if (!page) notFound()

  const startsWithHero = page.layout?.[0]?.blockType === 'hero'
  return (
    <>
      {!startsWithHero && <PageHeader title={page.title} crumbs={[{ label: page.title }]} />}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
