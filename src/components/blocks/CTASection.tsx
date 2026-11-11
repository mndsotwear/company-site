import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { RevealWords, Reveal } from '@/components/motion/Reveal'
import type { CTABlock } from '@/payload-types'

// فراخوان پایانی: نوار تیره‌ی تمام‌عرض با تیتر بسیار درشت و نور نارنجی ملایم
export function CTASection({ heading, text, link }: CTABlock) {
  return (
    <section className="grain relative isolate overflow-hidden bg-navy py-28 text-foam lg:py-40">
      <div className="pointer-events-none absolute -bottom-40 start-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px] rtl:translate-x-1/2" aria-hidden />
      <div className="chart-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container>
        <div className="max-w-4xl">
          {heading && <RevealWords text={heading} className="text-4xl font-black leading-[1.25] sm:text-6xl lg:text-7xl" />}
          {text && (
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-xl text-lg leading-8 text-foam/65">{text}</p>
            </Reveal>
          )}
          {link?.label && (
            <Reveal delay={0.4}>
              <Button href={link.href || '/contact'} variant="accent" size="lg" className="mt-12">
                {link.label}
              </Button>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}
