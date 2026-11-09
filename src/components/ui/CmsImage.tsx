import Image from 'next/image'
import type { Media } from '@/payload-types'

type Props = {
  media: number | Media | null | undefined
  size?: 'thumb' | 'card' | 'hero'
  className?: string
  /** پر کردن کادر والد (والد باید relative باشد) */
  fill?: boolean
  sizes?: string
  priority?: boolean
}

/** نمایش عکس آپلودشده در پنل با بهینه‌سازی خودکار Next.js */
export function CmsImage({ media, size, className = '', fill = false, sizes, priority }: Props) {
  if (!media || typeof media === 'number') return null
  const variant = size ? media.sizes?.[size] : undefined
  const src = variant?.url || media.url
  if (!src) return null
  if (fill) {
    return <Image src={src} alt={media.alt || ''} fill sizes={sizes || '100vw'} className={`object-cover ${className}`} priority={priority} />
  }
  return (
    <Image
      src={src}
      alt={media.alt || ''}
      width={variant?.width || media.width || 1200}
      height={variant?.height || media.height || 800}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  )
}
