import { Section } from '@/components/ui/Section'
import type { FAQBlock } from '@/payload-types'

// سؤالات متداول با باز و بسته شدن (بدون جاوااسکریپت)
export function FAQSection({ heading, items }: FAQBlock) {
  if (!items?.length) return null
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12">
        {heading && <h2 className="text-3xl font-extrabold lg:col-span-4">{heading}</h2>}
        <div className="divide-y divide-border border-y border-border lg:col-span-8">
          {items.map((q) => (
            <details key={q.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q.question}
                <span className="text-xl text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-8 text-muted">{q.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}
