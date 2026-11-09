import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// به‌جای Link و useRouter معمولی Next از این‌ها استفاده می‌کنیم تا زبان در آدرس حفظ شود
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
