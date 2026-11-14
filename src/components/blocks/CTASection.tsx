import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { RevealWords, Reveal } from '@/components/motion/Reveal'
import type { CTABlock } from '@/payload-types'

// فراخوان پایانی: یک کارت بزرگ با رنگ اصلی تم (رنگ تخت، بدون گرادیان) و تیتر درشت
export function CTASection({ heading, text, link }: CTABlock) {
  return (
    <section className="bg-bg py-20 lg:py-28">
      <Container>
        <div className="rounded-[2.5rem] bg-primary px-8 py-16 text-white sm:px-14 lg:px-20 lg:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              {heading && <RevealWords text={heading} className="text-4xl font-black leading-[1.25] sm:text-5xl lg:text-6xl" />}
              {text && (
                <Reveal delay={0.2}>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">{text}</p>
                </Reveal>
              )}
            </div>
            {link?.label && (
              <Reveal delay={0.35} className="lg:col-span-4 lg:justify-self-end">
                <Button href={link.href || '/contact'} variant="sky" size="lg">
                  {link.label}
                </Button>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
