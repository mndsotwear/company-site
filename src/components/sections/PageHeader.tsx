import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui/Container'

type Crumb = { href?: string; label: string }
type Props = { eyebrow?: string | null; title: string; intro?: string | null; crumbs?: Crumb[] }

// سربرگ صفحات داخلی: نوار سرمه‌ای با خطوط نقشه، مسیر صفحه (breadcrumb)، تیتر و متن کوتاه
export async function PageHeader({ eyebrow, title, intro, crumbs = [] }: Props) {
  const t = await getTranslations('nav')
  const trail: Crumb[] = [{ href: '/', label: t('home') }, ...crumbs]
  return (
    <section className="relative overflow-hidden bg-navy text-foam">
      <div className="chart-grid absolute inset-0" aria-hidden />
      <Container className="relative pb-16 pt-14 lg:pb-20 lg:pt-16">
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
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow && (
              <p className="mb-4 inline-flex items-center gap-3 text-sm text-sky">
                <span className="h-px w-10 bg-sky" aria-hidden />
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl font-extrabold leading-[1.4] sm:text-5xl">{title}</h1>
          </div>
          {intro && <p className="text-base leading-8 text-foam/70 lg:col-span-5">{intro}</p>}
        </div>
      </Container>
    </section>
  )
}
