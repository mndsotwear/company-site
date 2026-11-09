import type { Access, FieldAccess } from 'payload'

// دو نقش: مدیر (شما) و ویرایشگر (کارفرما)
export type Role = 'admin' | 'editor'

type UserWithRole = { role?: Role } | null | undefined

export const isAdmin = (user: UserWithRole) => user?.role === 'admin'

/** فقط مدیر */
export const adminOnly: Access = ({ req: { user } }) => isAdmin(user as UserWithRole)
/** هر کاربر واردشده (مدیر یا ویرایشگر) */
export const loggedIn: Access = ({ req: { user } }) => Boolean(user)
/** همه، حتی بازدیدکننده‌ی سایت */
export const anyone: Access = () => true
/** فیلدی که فقط مدیر تغییرش می‌دهد */
export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdmin(user as UserWithRole)
