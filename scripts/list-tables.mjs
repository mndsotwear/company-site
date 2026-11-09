// فهرست جدول‌های دیتابیس (برای بررسی)
import pg from 'pg'
import { readFileSync } from 'node:fs'
const uri = readFileSync('.env', 'utf8').match(/^DATABASE_URI=(.+)$/m)[1].trim()
const c = new pg.Client({ connectionString: uri })
await c.connect()
const { rows } = await c.query("select table_name from information_schema.tables where table_schema='public' order by 1")
console.log(rows.map((r) => r.table_name).join('\n'))
await c.end()
