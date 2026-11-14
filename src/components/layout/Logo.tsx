/* eslint-disable @next/next/no-img-element */
type Props = { light?: string | null; dark?: string | null; name: string; tagline: string }

// اگر لوگو در پنل آپلود شده باشد عکس، وگرنه نام شرکت
export function Logo({ light, dark, name, tagline }: Props) {
  if (light || dark) {
    return (
      <>
        {/* روی عکس (هدر شفاف) و در تم تیره نسخه‌ی روشن لوگو، در تم روشن بعد از اسکرول نسخه‌ی تیره */}
        <img src={(light || dark)!} alt={name} className="h-10 w-auto group-data-[over-hero=true]:hidden dark:hidden" />
        <img src={(dark || light)!} alt={name} className="hidden h-10 w-auto group-data-[over-hero=true]:block dark:block" />
      </>
    )
  }
  return (
    <span className="flex items-baseline gap-3 whitespace-nowrap text-current">
      <span className="text-xl font-black tracking-tight">{name}</span>
      <span className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 xl:inline">{tagline}</span>
    </span>
  )
}
