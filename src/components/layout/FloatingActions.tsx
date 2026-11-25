'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

type Props = { quoteLabel: string; whatsappHref: string | null; whatsappLabel: string; phoneHref: string | null; phoneLabel: string }

// دکمه‌های شناور: استعلام قیمت (نارنجی) + واتساپ
// بعد از رد شدن از بالای صفحه ظاهر می‌شوند تا روی کادر رهگیری هیرو نیفتند
export function FloatingActions({ quoteLabel, whatsappHref, whatsappLabel, phoneHref, phoneLabel }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // صفحه‌ی کوتاه: همیشه نمایش؛ صفحه‌ی بلند: بعد از اسکرول از هیرو
      const max = document.documentElement.scrollHeight - window.innerHeight
      setVisible(max < 120 || window.scrollY > Math.min(480, max * 0.6))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-5 end-5 z-30 flex items-center gap-2 transition duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      {phoneHref && (
        <a
          href={phoneHref}
          aria-label={phoneLabel}
          title={phoneLabel}
          className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-lg transition hover:brightness-110 sm:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1Z" />
          </svg>
        </a>
      )}
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappLabel}
          title={whatsappLabel}
          className="grid h-12 w-12 place-items-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:brightness-110"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.4.4 0 0 0 0-.4c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.2-.2-.2-.5-.4Z" />
          </svg>
        </a>
      )}
      <Link
        href="/quote"
        className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
      >
        {quoteLabel}
      </Link>
    </div>
  )
}
