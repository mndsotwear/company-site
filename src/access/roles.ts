import type { Access, FieldAccess } from 'payload'

// دو نقش: مدیر (شما) و ویرایشگر (کارفرما)
export type Role = 'admin' | 'editor'

type UserWithRole = { role?: Role } | null | undefined

export const isAdmin = (user: UserWithRole) => user?.role === 'admin'

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user as UserWithRole)
export const loggedIn: Access = ({ req: { user } }) => Boolean(user)
export const anyone: Access = () => true
export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdmin(user as UserWithRole)
