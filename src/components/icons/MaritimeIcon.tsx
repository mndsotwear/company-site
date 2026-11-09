// آیکون‌های خطی اختصاصی با موضوع دریایی؛ همه با ضخامت خط یکسان (1.6)
// نام‌ها با گزینه‌های «آیکون» در بخش خدمات پنل یکی است.

export type MaritimeIconName = 'ship' | 'container' | 'truck' | 'warehouse' | 'crane' | 'anchor' | 'box'

const PATHS: Record<MaritimeIconName, React.ReactNode> = {
  ship: (
    <>
      <path d="M3 15.5h18l-2.2 4.2a1.5 1.5 0 0 1-1.3.8H6.5a1.5 1.5 0 0 1-1.3-.8L3 15.5Z" />
      <path d="M6 15.5V11h12v4.5" />
      <path d="M9 11V7.5h4V11" />
      <path d="M11 7.5V4" />
    </>
  ),
  container: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M7 9v6M11 9v6M15 9v6M19 9v6" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v9h-11z" />
      <path d="M13.5 9.5h4l3 3v3h-7" />
      <circle cx="6.5" cy="17.5" r="1.7" />
      <circle cx="16.5" cy="17.5" r="1.7" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 20V9l9-5 9 5v11" />
      <path d="M7 20v-7h10v7" />
      <path d="M7 16.5h10" />
    </>
  ),
  crane: (
    <>
      <path d="M6 21V4h2v17" />
      <path d="M8 5h12" />
      <path d="M8 8.5 11.5 5" />
      <path d="M17 5v5" />
      <rect x="15" y="10" width="4" height="3" rx=".5" />
      <path d="M3 21h8" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v14" />
      <path d="M8.5 11h7" />
      <path d="M4.5 14a7.5 7.5 0 0 0 15 0" />
      <path d="M4.5 14 3 15.5M19.5 14l1.5 1.5" />
    </>
  ),
  box: (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
      <path d="M3.5 7.5 12 12l8.5-4.5" />
      <path d="M12 12v9" />
    </>
  ),
}

export function MaritimeIcon({ name, className = 'h-7 w-7' }: { name?: string | null; className?: string }) {
  const icon = PATHS[(name as MaritimeIconName) || 'ship'] ?? PATHS.ship
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {icon}
    </svg>
  )
}
