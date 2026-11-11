import { create, CappedMap, randomInt } from 'altcha-lib/frameworks/nextjs'
import { deriveKey } from 'altcha-lib/algorithms/sha'

// کپچای ALTCHA (بدون گوگل، روی سرور خودمان): مرورگر یک معمای ریاضی کوچک را حل می‌کند
// که برای انسان یکی دو ثانیه طول می‌کشد ولی برای ربات‌هایی که هزاران جستجو می‌زنند گران است.
const store = new CappedMap<string, boolean>({ maxSize: 10_000 })
const secret = process.env.ALTCHA_HMAC_KEY || process.env.PAYLOAD_SECRET || 'altcha-dev-secret'

export const altcha = create({
  deriveKey,
  hmacSignatureSecret: secret,
  hmacKeySignatureSecret: `${secret}:key`,
  // هر پاسخ فقط یک بار قابل استفاده است
  store,
  createChallengeParameters: () => ({
    // سختی: حدود ۱ ثانیه روی گوشی معمولی
    algorithm: 'SHA-256',
    cost: 20,
    counter: randomInt(5_000, 10_000),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  }),
})

/** true اگر پاسخ کپچا معتبر و تازه باشد */
export async function verifyAltcha(payload: string | undefined | null): Promise<boolean> {
  if (!payload) return false
  try {
    const { error } = await altcha.verify(payload, deriveKey, secret, `${secret}:key`, store)
    return !error
  } catch {
    return false
  }
}
