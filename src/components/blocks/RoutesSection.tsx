import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { RoutesBlock } from '@/payload-types'

// مسیرها: مبدأ ــ خط نقطه‌چین با کشتی ــ مقصد (مثل جدول حرکت بندر)
export function RoutesSection({ eyebrow, heading, intro, routes }: RoutesBlock) {
  if (!routes?.length) return null
  return (
    <Section grid>
      <SectionHeading eyebrow={eyebrow} title={heading} intro={intro} />
      <ul className="divide-y divide-border border-y border-border">
        {routes.map((r) => (
          <li key={r.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[8rem_1fr_12rem] sm:gap-8 sm:py-6">
            <span className="text-lg font-bold sm:text-xl">{r.from}</span>
            <span className="relative flex items-center" aria-hidden>
              <span className="h-0 w-full border-t-2 border-dashed border-primary/40" />
              <span className="absolute start-1/2 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-primary/40 bg-bg text-[11px] text-primary rtl:translate-x-1/2">
                ⛴
              </span>
            </span>
            <span className="text-end">
              <span className="block text-lg font-bold sm:text-xl">{r.to}</span>
              {r.note && <span className="text-sm text-muted">{r.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
