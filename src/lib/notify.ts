import type { Payload } from 'payload'

// اطلاع‌رسانی با پیامک (کاوه‌نگار) و ایمیل.
// اگر کلید پیامک یا تنظیمات ایمیل وارد نشده باشد، پیام فقط در ترمینال نوشته می‌شود
// و درخواست در پنل ذخیره می‌ماند (چیزی از دست نمی‌رود).

export async function sendSms(payload: Payload, to: string | null | undefined, text: string) {
  if (!to) return
  const key = process.env.KAVENEGAR_API_KEY
  const sender = process.env.KAVENEGAR_SENDER
  if (!key) {
    payload.logger.info(`[sms:skipped] to=${to} :: ${text}`)
    return
  }
  try {
    const body = new URLSearchParams({ receptor: to, message: text, ...(sender ? { sender } : {}) })
    const res = await fetch(`https://api.kavenegar.com/v1/${key}/sms/send.json`, { method: 'POST', body })
    if (!res.ok) payload.logger.error(`[sms] failed ${res.status}: ${await res.text()}`)
  } catch (e) {
    payload.logger.error(`[sms] error: ${(e as Error).message}`)
  }
}

export async function sendMail(payload: Payload, to: string | null | undefined, subject: string, html: string) {
  if (!to) return
  try {
    await payload.sendEmail({ to, subject, html })
  } catch (e) {
    payload.logger.error(`[email] error: ${(e as Error).message}`)
  }
}

/** جدول ساده‌ی HTML برای ایمیل (راست‌چین) */
export const emailTable = (title: string, rows: [string, string | number | null | undefined][]) => `
<div dir="rtl" style="font-family:Tahoma,sans-serif;font-size:14px;color:#071b30">
  <h2 style="color:#0787c2">${title}</h2>
  <table cellpadding="8" style="border-collapse:collapse">
    ${rows
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(
        ([k, v]) =>
          `<tr><td style="border-bottom:1px solid #d5e2ec;color:#4a5b6e">${k}</td><td style="border-bottom:1px solid #d5e2ec"><b>${String(v)
            .replace(/</g, '&lt;')
            .replace(/\n/g, '<br>')}</b></td></tr>`,
      )
      .join('')}
  </table>
</div>`
