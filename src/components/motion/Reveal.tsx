'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'section' }

// ظاهر شدن نرم هنگام رسیدن به بخش (از پایین، با کمی محوی)
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  if (reduce) return <Tag className={className}>{children}</Tag>
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

// تیتر کلمه‌به‌کلمه: هر کلمه از زیر خط بالا می‌آید.
// دیده شدن روی خود تیتر سنجیده می‌شود (نه روی کلمه‌ها که داخل قاب پنهان‌اند).
export function RevealWords({ text, className, delay = 0, as = 'h2' }: { text: string; className?: string; delay?: number; as?: 'h1' | 'h2' | 'p' }) {
  const reduce = useReducedMotion()
  if (reduce) {
    const Tag = as
    return <Tag className={className}>{text}</Tag>
  }
  const Tag = motion[as]
  const words = text.split(/\s+/)
  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease: EASE } } }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && '\u00a0'}
        </span>
      ))}
    </Tag>
  )
}
