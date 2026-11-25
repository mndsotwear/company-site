import type { Payload } from 'payload'

// اعلان فوری به گروه یا کانال مدیریت با ربات (تلگرام یا بله).
// تنظیم: TELEGRAM_BOT_TOKEN در .env و «شناسه‌ی چت» در پنل (تنظیمات سایت ← اعلان‌ها).
// اگر توکن یا شناسه خالی باشد فقط در ترمینال نوشته می‌شود و چیزی از دست نمی‌رود.
// برای ربات «بله» مقدار TELEGRAM_API_BASE=https://tapi.bale.ai را بگذارید (همان API تلگرام است).
// اگر سرور به تلگرام دسترسی ندارد، از بله یا یک پروکسی (TELEGRAM_API_BASE) استفاده کنید.

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function sendTelegram(
  payload: Payload,
  chatId: string | null | undefined,
  title: string,
  rows: [string, string | number | null | undefined][],
  link?: string,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const lines = rows.filter(([, v]) => v !== null && v !== undefined && v !== '').map(([k, v]) => `${esc(k)}: <b>${esc(String(v))}</b>`)
  const text = [`<b>${esc(title)}</b>`, ...lines, ...(link ? [esc(link)] : [])].join('\n')
  if (!token || !chatId) {
    payload.logger.info(`[telegram:skipped] ${title}`)
    return
  }
  try {
    const base = (process.env.TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/$/, '')
    const res = await fetch(`${base}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) payload.logger.error(`[telegram] failed ${res.status}: ${await res.text()}`)
  } catch (e) {
    payload.logger.error(`[telegram] error: ${(e as Error).message}`)
  }
}
