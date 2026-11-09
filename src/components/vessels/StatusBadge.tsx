import { labelOf, VESSEL_STATUS_OPTIONS } from '@/lib/options'

const COLORS: Record<string, string> = {
  available: 'bg-emerald-600 text-white',
  reserved: 'bg-amber-500 text-navy',
  sold: 'bg-ink text-foam',
}

export function StatusBadge({ status, locale }: { status: string; locale: 'fa' | 'en' }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${COLORS[status] || COLORS.available}`}>
      {labelOf(VESSEL_STATUS_OPTIONS, status, locale)}
    </span>
  )
}
