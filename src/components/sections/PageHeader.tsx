import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/Container'
import { Reveal, RevealWords } from '@/components/motion/Reveal'

type Crumb = { href?: string; label: string }
type Props = { eyebrow?: string | null; title: string; intro?: string | null; crumbs?: Crumb[] }

// سربرگ صفحات داخلی: نوار سرمه‌ای با خطوط نقشه، مسیر صفحه (breadcrumb)، تیتر و متن کوتاه
export async function PageHeader({ eyebrow, title, intro, crumbs = [] }: Props) {
  const t = await getTranslations('nav')
  const trail: Crumb[] = [{ href: '/', label: t('home') }, ...crumbs]
  return (
    <section className="relative border-b border-border bg-bg text-text">
      <Container className="relative pb-16 pt-36 lg:pb-24 lg:pt-44">
        <nav aria-label="breadcrumb" className="mb-10 text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            {trail.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="hover:text-primary">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={i === trail.length - 1 ? 'page' : undefined}>{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow && (
              <Reveal>
                <p className="mb-6 inline-flex items-center gap-4 text-xs tracking-[0.2em] text-muted">
                  <span className="h-px w-10 bg-primary" aria-hidden />
                  {eyebrow}
                </p>
              </Reveal>
            )}
            <RevealWords as="h1" text={title} className="text-4xl font-black leading-[1.3] sm:text-6xl" />
          </div>
          {intro && (
            <Reveal delay={0.25} className="lg:col-span-5">
              <p className="text-base leading-8 text-muted">{intro}</p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}
