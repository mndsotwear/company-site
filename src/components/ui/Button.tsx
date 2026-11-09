import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

type Variant = 'primary' | 'sky' | 'accent' | 'outline' | 'outlineLight' | 'ghost'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:brightness-110',
  /** آبی روشن روی زمینه‌ی سرمه‌ای (مثل هیرو) */
  sky: 'bg-sky text-navy hover:brightness-110',
  accent: 'bg-accent text-white hover:brightness-110',
  outline: 'border border-border text-text hover:border-primary hover:text-primary',
  outlineLight: 'border border-foam/40 text-foam hover:border-sky hover:text-sky',
  ghost: 'text-primary hover:underline underline-offset-8',
}

const SIZES: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href)

/** دکمه‌ی لینک؛ آدرس داخلی (مثل /quote) زبان فعلی را حفظ می‌کند */
export function Button({ href, children, variant = 'primary', size = 'md', className = '' }: Props) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  if (isExternal(href)) {
    const newTab = href.startsWith('http')
    return (
      <a href={href} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}
