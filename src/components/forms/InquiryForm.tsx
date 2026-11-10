'use client'

import { startTransition, useActionState, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { submitInquiry, type InquiryState } from '@/app/(frontend)/[locale]/fleet/[slug]/actions'
import { CONTACT_VIA_OPTIONS } from '@/lib/options'
import { Field, inputCls } from './fields'

const initial: InquiryState = { ok: false }

// فرم درخواست خرید کشتی (در صفحه‌ی هر کشتی)
export function InquiryForm({ vesselId, vesselName }: { vesselId: number; vesselName: string }) {
  const t = useTranslations('inquiry')
  const locale = useLocale() as 'fa' | 'en'
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const [startedAt] = useState(() => Date.now())
  const invalid = state.fields || []
  const err = (name: string, key = 'field') => (invalid.includes(name) ? t(`errors.${key}`) : undefined)

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8" role="status">
        <p className="text-sm text-primary">{t('success.eyebrow')}</p>
        <p className="mt-3 text-2xl font-extrabold">{t('success.title')}</p>
        <p className="mt-3 leading-8 text-muted">{t('success.text', { vessel: vesselName })}</p>
      </div>
    )
  }

  return (
    <form
      // ارسال دستی تا React بعد از پاسخ سرور فیلدها را پاک نکند (اگر خطا بود، نوشته‌های کاربر بماند)
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(() => action(fd))
      }}
      className="relative grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2 sm:p-8">
      <input type="hidden" name="vessel" value={vesselId} />
      <input type="hidden" name="_t" value={startedAt} />
      <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label={t('name')} name="name" required error={invalid.includes('name')} hint={err('name')}>
        <input id="f-name" name="name" required minLength={2} maxLength={120} autoComplete="name" aria-invalid={invalid.includes('name')} className={inputCls} />
      </Field>
      <Field label={t('company')} name="company">
        <input id="f-company" name="company" maxLength={120} autoComplete="organization" className={inputCls} />
      </Field>
      <Field label={t('phone')} name="phone" required error={invalid.includes('phone')} hint={err('phone', 'phone')}>
        <input id="f-phone" name="phone" type="tel" required dir="ltr" autoComplete="tel" placeholder="09xxxxxxxxx" aria-invalid={invalid.includes('phone')} className={`${inputCls} text-start`} />
      </Field>
      <Field label={t('email')} name="email" error={invalid.includes('email')} hint={err('email', 'email')}>
        <input id="f-email" name="email" type="email" dir="ltr" autoComplete="email" aria-invalid={invalid.includes('email')} className={`${inputCls} text-start`} />
      </Field>
      <div className="sm:col-span-2">
        <Field label={t('message')} name="message">
          <textarea id="f-message" name="message" rows={4} maxLength={2000} placeholder={t('messagePlaceholder')} className={inputCls} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <p className="mb-3 text-sm font-semibold">{t('contactVia')}</p>
        <div className="flex flex-wrap gap-3">
          {CONTACT_VIA_OPTIONS.map((o, i) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm has-[:checked]:border-primary has-[:checked]:text-primary"
            >
              <input type="radio" name="contactVia" value={o.value} defaultChecked={i === 0} className="accent-[var(--primary)]" />
              {o.label[locale]}
            </label>
          ))}
        </div>
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 sm:col-span-2 dark:text-red-400" role="alert">
          {t(`errors.${state.error}`)}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? t('sending') : t('submit')}
        </button>
      </div>
    </form>
  )
}
