import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import type { CTABlock } from '@/payload-types'

// فراخوان: نوار کوتاه با تیتر و یک دکمه‌ی نارنجی
export function CTASection({ heading, text, link }: CTABlock) {
  return (
    <section className="bg-bg py-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            {heading && <h2 className="text-2xl font-extrabold sm:text-3xl">{heading}</h2>}
            {text && <p className="mt-2 text-muted">{text}</p>}
          </div>
          {link?.label && (
            <Button href={link.href || '/contact'} variant="accent" size="lg" className="shrink-0">
              {link.label}
            </Button>
          )}
        </div>
      </Container>
    </section>
  )
}
