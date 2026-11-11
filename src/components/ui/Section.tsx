import type { ReactNode } from 'react'
import { Container } from './Container'

type Props = {
  children: ReactNode
  /** default = رنگ تم؛ navy = همیشه سرمه‌ای (مثل بخش‌های تیره‌ی سایت فعلی) */
  tone?: 'default' | 'surface' | 'navy'
  /** خطوط نقشه‌ی دریایی در پس‌زمینه */
  grid?: boolean
  id?: string
  className?: string
}

const TONES = {
  default: 'bg-bg text-text',
  surface: 'bg-surface text-text',
  navy: 'grain bg-navy text-foam',
}

/** یک بخش کامل صفحه با فاصله‌ی بالا و پایین یکسان */
export function Section({ children, tone = 'default', grid = false, id, className = '' }: Props) {
  return (
    <section id={id} data-tone={tone} className={`relative overflow-hidden py-24 lg:py-36 ${TONES[tone]} ${className}`}>
      {grid && <div className="chart-grid pointer-events-none absolute inset-0" aria-hidden />}
      <Container className="relative">{children}</Container>
    </section>
  )
}
