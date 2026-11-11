import { altcha } from '@/lib/altcha'

// دادن معمای کپچا به ویجت ALTCHA (صفحه‌ی رهگیری)
export const dynamic = 'force-dynamic'
export const GET = (req: Request) => altcha.challengeHandler(req)
