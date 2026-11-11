import { RevealWords, Reveal } from '@/components/motion/Reveal'

type Props = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  /** روی زمینه‌ی تیره‌ی ثابت (عکس یا بخش سرمه‌ای) */
  onDark?: boolean
  /** شماره‌ی بخش (مثل ۰۱) — حس مجله‌ای */
  index?: string
  className?: string
}

/**
 * تیتر بخش: شماره و برچسب کوچک، تیتر درشت که کلمه‌به‌کلمه ظاهر می‌شود، متن کوتاه در ستون کناری.
 * چیدمان نامتقارن (تیتر یک طرف، متن طرف دیگر) تا همه‌چیز وسط‌چین نباشد.
 */
export function SectionHeading({ eyebrow, title, intro, onDark = false, index, className = '' }: Props) {
  if (!eyebrow && !title && !intro) return null
  return (
    <div className={`mb-14 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-12 lg:items-end ${className}`}>
      <div className="lg:col-span-8">
        {eyebrow && (
          <Reveal>
            <p className={`mb-6 flex items-center gap-4 text-xs tracking-[0.2em] ${onDark ? 'text-foam/60' : 'text-muted'}`}>
              {index && <span className="display text-accent">{index}</span>}
              <span className={`h-px w-10 ${onDark ? 'bg-foam/30' : 'bg-border'}`} aria-hidden />
              {eyebrow}
            </p>
          </Reveal>
        )}
        {title && <RevealWords text={title} className="text-[2rem] font-black leading-[1.3] sm:text-5xl lg:text-[3.4rem]" />}
      </div>
      {intro && (
        <Reveal delay={0.2} className="lg:col-span-4">
          <p className={`text-base leading-8 ${onDark ? 'text-foam/65' : 'text-muted'}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  )
}
