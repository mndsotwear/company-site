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
    <section className="aurora grain relative overflow-hidden text-foam">
      <div className="pointer-events-none absolute -top-40 start-1/3 h-[480px] w-[480px] rounded-full bg-sky/15 blur-[120px]" aria-hidden />
      <div className="chart-grid absolute inset-0" aria-hidden />
      <Container className="relative pb-16 pt-36 lg:pb-24 lg:pt-44">
        <nav aria-label="breadcrumb" className="mb-10 text-xs text-foam/50">
          <ol className="flex flex-wrap items-center gap-2">
            {trail.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="hover:text-sky">
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
                <p className="mb-6 inline-flex items-center gap-4 text-xs tracking-[0.2em] text-foam/60">
                  <span className="h-px w-10 bg-accent" aria-hidden />
                  {eyebrow}
                </p>
              </Reveal>
            )}
            <RevealWords as="h1" text={title} className="text-4xl font-black leading-[1.3] sm:text-6xl" />
          </div>
          {intro && (
            <Reveal delay={0.25} className="lg:col-span-5">
              <p className="text-base leading-8 text-foam/65">{intro}</p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}
