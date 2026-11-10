import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intl = createMiddleware(routing)

// Payload زبان پنل را اول از کوکی payload-lng و بعد از زبان مرورگر می‌خواند.
// مرورگرها معمولاً انگلیسی را اول می‌فرستند، پس پنل انگلیسی باز می‌شد.
// اگر کاربر هنوز زبانی انتخاب نکرده، فارسی را پیش‌فرض می‌گذاریم؛
// انتخاب دستی از صفحه‌ی حساب کاربری همچنان کار می‌کند.
const ADMIN_LANG_COOKIE = 'payload-lng'

export default function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (req.cookies.has(ADMIN_LANG_COOKIE)) return NextResponse.next()
    req.cookies.set(ADMIN_LANG_COOKIE, 'fa')
    const res = NextResponse.next({ request: { headers: req.headers } })
    res.cookies.set(ADMIN_LANG_COOKIE, 'fa', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return res
  }
  return intl(req)
}

export const config = {
  // API، فایل‌ها و فایل‌های Next از proxy معاف‌اند؛ پنل (/admin) فقط برای زبان پیش‌فرض رد می‌شود
  matcher: ['/admin/:path*', '/((?!api|admin|_next|_vercel|media|.*\\..*).*)'],
}
