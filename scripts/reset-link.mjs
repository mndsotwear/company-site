// نمایش لینک تغییر رمز (بعد از زدن «Forgot password?» در صفحه‌ی ورود)
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = readFileSync('.env', 'utf8')
const uri = env.match(/^DATABASE_URI=(.+)$/m)[1].trim()
const site = (env.match(/^NEXT_PUBLIC_SITE_URL=(.+)$/m)?.[1] || 'http://localhost:3000').trim()
const c = new pg.Client({ connectionString: uri })
await c.connect()
const r = await c.query(
  'SELECT email, reset_password_token AS t, reset_password_expiration AS exp FROM users WHERE reset_password_token IS NOT NULL',
)
if (!r.rows.length) console.log('No reset request found. Click "Forgot password?" first.')
for (const u of r.rows) console.log(`${u.email}\n${site}/admin/reset/${u.t}\n(valid until ${u.exp})`)
await c.end()
