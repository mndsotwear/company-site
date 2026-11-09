/* eslint-disable @next/next/no-img-element */
type Props = { light?: string | null; dark?: string | null; name: string; tagline: string }

// اگر لوگو در پنل آپلود شده باشد عکس، وگرنه نام شرکت
export function Logo({ light, dark, name, tagline }: Props) {
  if (light || dark) {
    return (
      <>
        <img src={(light || dark)!} alt={name} className="h-10 w-auto dark:hidden" />
        <img src={(dark || light)!} alt={name} className="hidden h-10 w-auto dark:block" />
      </>
    )
  }
  return (
    <span className="flex items-baseline gap-2 text-text">
      <span className="text-xl font-extrabold tracking-tight">{name}</span>
      <span className="hidden text-xs text-muted sm:inline">{tagline}</span>
    </span>
  )
}
