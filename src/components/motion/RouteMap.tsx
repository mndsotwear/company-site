'use client'

import { motion, useReducedMotion } from 'motion/react'

// نمودار مسیرها (شماتیک، نه نقشه‌ی دقیق): دو بندر مبدأ (آبادان، خرمشهر) در یک طرف،
// چهار مقصد در طرف دیگر؛ کمان‌ها هنگام رسیدن به بخش کشیده می‌شوند.
// در فارسی مبدأ سمت راست است (جهت خواندن)، در انگلیسی سمت چپ.
// names به ترتیب پیام‌ها: [آبادان، خرمشهر، ام‌القصر، بصره، کویت، دبی]
const EASE = [0.22, 1, 0.36, 1] as const

export function RouteMap({ names, rtl }: { names: string[]; rtl: boolean }) {
  const reduce = useReducedMotion()
  const W = 1000
  const fx = (x: number) => (rtl ? W - x : x)
  const origins = [
    { name: names[0], x: fx(150), y: 230, main: true },
    { name: names[1], x: fx(150), y: 410, main: false },
  ]
  const dests = [2, 3, 4, 5].map((n, i) => ({ name: names[n], x: fx(850), y: 100 + i * 147 }))
  const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2
    return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`
  }

  return (
    <svg viewBox="0 0 1000 640" className="h-auto w-full" role="img" aria-label={names.join('، ')}>
      {/* خطوط شبکه‌ی نقشه‌ی دریایی */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={(i + 1) * 100} y1={20} x2={(i + 1) * 100} y2={620} stroke="currentColor" strokeOpacity={0.05} />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`h${i}`} x1={20} y1={(i + 1) * 107} x2={980} y2={(i + 1) * 107} stroke="currentColor" strokeOpacity={0.05} />
      ))}

      {origins.map((o, oi) =>
        dests.map((d, di) => (
          <motion.path
            key={`${oi}-${di}`}
            d={arc(o, d)}
            fill="none"
            stroke={o.main ? 'var(--accent)' : 'currentColor'}
            strokeOpacity={o.main ? 0.9 : 0.25}
            strokeWidth={o.main ? 1.6 : 1}
            strokeDasharray={o.main ? '2 8' : '1 6'}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.6, delay: 0.2 + di * 0.15 + oi * 0.4, ease: EASE }}
          />
        )),
      )}

      {origins.map((o) => (
        <g key={o.name}>
          {o.main && (
            <motion.circle
              cx={o.x}
              cy={o.y}
              r={22}
              fill="var(--accent)"
              initial={{ opacity: 0.25, scale: 0.6 }}
              animate={reduce ? undefined : { opacity: [0.25, 0, 0.25], scale: [0.6, 1.4, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: `${o.x}px ${o.y}px` }}
            />
          )}
          <circle cx={o.x} cy={o.y} r={o.main ? 9 : 7} fill={o.main ? 'var(--accent)' : 'currentColor'} />
          <text x={o.x} y={o.y - 40} textAnchor="middle" fontSize={o.main ? 40 : 32} fontWeight={o.main ? 800 : 500} fill="currentColor">
            {o.name}
          </text>
        </g>
      ))}

      {dests.map((d, i) => (
        <motion.g
          key={d.name}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 + i * 0.15 }}
        >
          <circle cx={d.x} cy={d.y} r={7} fill="none" stroke="currentColor" strokeWidth={1.5} />
          <text x={d.x} y={d.y - 22} textAnchor="middle" fontSize={32} fontWeight={600} fill="currentColor" fillOpacity={0.85}>
            {d.name}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}
