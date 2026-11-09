// ساخت دیتابیس shahin_marine در سرویس DBngin (اگر وجود نداشته باشد)
// اجرا: npm run db:create
import pg from 'pg'
import { readFileSync } from 'node:fs'

const env = readFileSync('.env', 'utf8')
const uri = env.match(/^DATABASE_URI=(.+)$/m)?.[1]?.trim()
if (!uri) throw new Error('DATABASE_URI not found in .env')

const url = new URL(uri)
const dbName = url.pathname.slice(1)
url.pathname = '/postgres'

const client = new pg.Client({ connectionString: url.toString() })
try {
  await client.connect()
} catch (e) {
  console.error('Cannot connect to PostgreSQL. Is the "shahin-marine" service started in DBngin?')
  console.error(e.message)
  process.exit(1)
}
const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])
if (rowCount) {
  console.log(`Database "${dbName}" already exists.`)
} else {
  await client.query(`CREATE DATABASE "${dbName}"`)
  console.log(`Database "${dbName}" created.`)
}
await client.end()
