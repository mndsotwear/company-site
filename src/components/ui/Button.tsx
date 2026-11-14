import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

type Variant = 'primary' | 'sky' | 'accent' | 'outline' | 'outlineLight' | 'ghost'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-text text-bg hover:bg-accent hover:text-white',
  /** روشن روی زمینه‌ی تیره */
  sky: 'bg-foam text-navy hover:bg-accent hover:text-white',
  accent: 'bg-primary text-white hover:bg-accent',
  outline: 'border border-border text-text hover:border-text',
  outlineLight: 'border border-white/25 bg-white/[0.04] text-foam backdrop-blur hover:border-white/60 hover:bg-white/10',
  ghost: 'text-text link-line pb-1',
}

const SIZES: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-[15px]',
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
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-500 ease-[var(--ease-luxe)] ${VARIANTS[variant]} ${SIZES[size]} ${className}`
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
