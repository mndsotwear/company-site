type Props = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  /** روی زمینه‌ی سرمه‌ای */
  onDark?: boolean
  className?: string
}

/**
 * تیتر بخش: متن کوچک با خط کوتاه (مثل سایت فعلی)، تیتر درشت، متن کوتاه.
 * چیدمان کنار هم در دسکتاپ (تیتر یک طرف، متن طرف دیگر) تا همه‌چیز وسط‌چین نباشد.
 */
export function SectionHeading({ eyebrow, title, intro, onDark = false, className = '' }: Props) {
  if (!eyebrow && !title && !intro) return null
  return (
    <div className={`mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end ${className}`}>
      <div className="lg:col-span-7">
        {eyebrow && (
          <p className={`mb-4 inline-flex items-center gap-3 text-sm ${onDark ? 'text-sky' : 'text-primary'}`}>
            <span className={`h-px w-10 ${onDark ? 'bg-sky' : 'bg-primary'}`} aria-hidden />
            {eyebrow}
          </p>
        )}
        {title && <h2 className="text-3xl font-extrabold leading-[1.45] sm:text-4xl">{title}</h2>}
      </div>
      {intro && (
        <p className={`text-base leading-8 lg:col-span-5 ${onDark ? 'text-foam/70' : 'text-muted'}`}>{intro}</p>
      )}
    </div>
  )
}
