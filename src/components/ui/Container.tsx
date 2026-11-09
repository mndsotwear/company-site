import type { ReactNode } from 'react'

/** عرض استاندارد محتوا با فاصله‌ی ۲۰ پیکسل از لبه‌ها */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 ${className}`}>{children}</div>
}
