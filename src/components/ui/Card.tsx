import type { ReactNode } from 'react'

/** کارت ساده با حاشیه؛ در حالت hover حاشیه آبی می‌شود */
export function Card({ children, className = '', interactive = false }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 ${
        interactive ? 'transition hover:-translate-y-0.5 hover:border-primary' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
