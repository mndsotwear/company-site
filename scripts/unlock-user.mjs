// باز کردن قفل حساب پنل بعد از رمزهای اشتباه زیاد (رمز را تغییر نمی‌دهد)
import pg from 'pg'
import { readFileSync } from 'node:fs'
const uri = readFileSync('.env', 'utf8').match(/^DATABASE_URI=(.+)$/m)[1].trim()
const c = new pg.Client({ connectionString: uri })
await c.connect()
const r = await c.query('UPDATE users SET login_attempts = 0, lock_until = NULL RETURNING email')
console.log('Unlocked:', r.rows.map((x) => x.email).join(', ') || '(no users)')
await c.end()
