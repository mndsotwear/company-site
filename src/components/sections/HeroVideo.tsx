'use client'

import { useEffect, useRef, useState } from 'react'

// ویدیوی پس‌زمینه‌ی هیرو: بی‌صدا و تکرارشونده؛ بعد از آماده شدن با محو نرم ظاهر می‌شود.
// برای «کاهش حرکت» و اینترنت کم‌حجم (Save-Data) پخش نمی‌شود و عکس می‌ماند.
export function HeroVideo({ src, type }: { src: string; type: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    setAllowed(!reduce && !saveData)
  }, [])
  if (!allowed) return null
  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.5s] ${ready ? 'opacity-100' : 'opacity-0'}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onCanPlay={() => setReady(true)}
    >
      <source src={src} type={type} />
    </video>
  )
}
