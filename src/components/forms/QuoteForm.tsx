'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { submitQuote, type QuoteState } from '@/app/(frontend)/[locale]/quote/actions'
import { Link } from '@/i18n/navigation'
import {
  CARGO_OPTIONS,
  CONTACT_VIA_OPTIONS,
  DESTINATION_OPTIONS,
  ORIGIN_OPTIONS,
  SERVICE_OPTIONS,
  TIMING_OPTIONS,
  type Option,
} from '@/lib/options'
import { Field, inputCls, SelectWithOther } from './fields'

// کدام فیلد در کدام گام است (برای پرش به گامی که خطا دارد)
const STEP_OF: Record<string, number> = {
  service: 0, serviceOther: 0, origin: 0, originOther: 0, destination: 0, destinationOther: 0, cargo: 0, cargoOther: 0,
  weight: 1, volume: 1, timing: 1, timingOther: 1, details: 1,
  name: 2, company: 2, phone: 2, email: 2, contactVia: 2,
}

const initial: QuoteState = { ok: false }

// فرم استعلام قیمت در ۳ گام: مسیر و بار ← جزئیات ← اطلاعات تماس
export type QuoteDefaults = { service?: string; origin?: string; destination?: string; cargo?: string }

export function QuoteForm({ defaults = {} }: { defaults?: QuoteDefaults }) {
  const t = useTranslations('quote')
  const locale = useLocale() as 'fa' | 'en'
  const [state, action, pending] = useActionState(submitQuote, initial)
  const [step, setStep] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const formRef = useRef<HTMLFormElement>(null)
  const steps = [t('steps.route'), t('steps.details'), t('steps.contact')]
  const invalid = state.fields || []
  const num = (n: number) => n.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')

  // خطای سرور: رفتن به اولین گامی که فیلد نامعتبر دارد
  useEffect(() => {
    if (state.fields?.length) setStep(Math.min(...state.fields.map((f) => STEP_OF[f] ?? 0)))
  }, [state])

  // بررسی فیلدهای همین گام قبل از رفتن به گام بعد
  const validateStep = () => {
    const fs = formRef.current?.querySelector<HTMLFieldSetElement>(`fieldset[data-step="${step}"]`)
    if (!fs) return true
    return [...fs.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input,select,textarea')].every((el) =>
      el.reportValidity(),
    )
  }

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 sm:p-12" role="status">
        <p className="text-sm text-primary">{t('success.eyebrow')}</p>
        <h2 className="mt-3 text-3xl font-extrabold">{t('success.title')}</h2>
        <p className="mt-4 leading-8 text-muted">{t('success.text')}</p>
        {state.trackingNumber && state.trackingNumber !== '—' && (
          <div className="mt-8 inline-block rounded-xl border border-dashed border-primary px-6 py-4">
            <p className="text-xs text-muted">{t('success.number')}</p>
            <p className="ltr-nums mt-1 text-2xl font-extrabold tracking-wider text-primary">{state.trackingNumber}</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary">
            {t('success.home')}
          </Link>
          <Link href="/services" className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary hover:underline">
            {t('success.services')}
          </Link>
        </div>
      </div>
    )
  }

  const select = (name: string, label: string, options: Option[], required = true, defaultValue = '') => (
    <SelectWithOther
      name={name}
      label={label}
      options={options}
      locale={locale}
      required={required}
      defaultValue={defaultValue}
      placeholder={required ? t('choose') : t('chooseOptional')}
      otherPlaceholder={t('otherPlaceholder')}
      invalid={invalid}
      errorText={t('errors.field')}
    />
  )
  const err = (name: string, key = 'field') => (invalid.includes(name) ? t(`errors.${key}`) : undefined)

  return (
    <form
      ref={formRef}
      noValidate
      // ارسال دستی تا React بعد از پاسخ سرور فیلدها را پاک نکند (اگر خطا بود، نوشته‌های کاربر بماند)
      onSubmit={(e) => {
        e.preventDefault()
        if (!validateStep()) return
        const fd = new FormData(e.currentTarget)
        startTransition(() => action(fd))
      }}
      className="relative rounded-2xl border border-border bg-surface p-6 sm:p-10"
    >
      {/* شماره‌ی گام‌ها مثل مسیر کشتی */}
      <ol className="mb-10 flex items-center gap-3 text-sm" aria-label={t('stepsLabel')}>
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-3 last:flex-none" aria-current={i === step ? 'step' : undefined}>
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                i < step
                  ? 'border-primary bg-primary text-white'
                  : i === step
                    ? 'border-primary text-primary'
                    : 'border-border text-muted'
              }`}
            >
              {num(i + 1)}
            </span>
            <span className={`hidden sm:inline ${i === step ? 'font-semibold' : 'text-muted'}`}>{s}</span>
            {i < steps.length - 1 && <span className="h-0 flex-1 border-t border-dashed border-border" aria-hidden />}
          </li>
        ))}
      </ol>

      {/* فیلدهای ضدربات و زبان */}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="_t" value={startedAt} />
      <div className="absolute -start-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset data-step="0" hidden={step !== 0} className="grid gap-6 sm:grid-cols-2">
        <legend className="sr-only">{steps[0]}</legend>
        <div className="sm:col-span-2">{select('service', t('service'), SERVICE_OPTIONS, true, defaults.service || '')}</div>
        {select('origin', t('origin'), ORIGIN_OPTIONS, true, defaults.origin || '')}
        {select('destination', t('destination'), DESTINATION_OPTIONS, true, defaults.destination || '')}
        <div className="sm:col-span-2">{select('cargo', t('cargo'), CARGO_OPTIONS, true, defaults.cargo || '')}</div>
      </fieldset>

      <fieldset data-step="1" hidden={step !== 1} className="grid gap-6 sm:grid-cols-2">
        <legend className="sr-only">{steps[1]}</legend>
        <Field label={t('weight')} name="weight" error={invalid.includes('weight')} hint={err('weight')}>
          <input id="f-weight" name="weight" inputMode="decimal" placeholder={t('weightPlaceholder')} className={inputCls} />
        </Field>
        <Field label={t('volume')} name="volume">
          <input id="f-volume" name="volume" maxLength={120} placeholder={t('volumePlaceholder')} className={inputCls} />
        </Field>
        <div className="sm:col-span-2">{select('timing', t('timing'), TIMING_OPTIONS, false)}</div>
        <div className="sm:col-span-2">
          <Field label={t('details')} name="details">
            <textarea id="f-details" name="details" rows={4} maxLength={2000} placeholder={t('detailsPlaceholder')} className={inputCls} />
          </Field>
        </div>
      </fieldset>

      <fieldset data-step="2" hidden={step !== 2} className="grid gap-6 sm:grid-cols-2">
        <legend className="sr-only">{steps[2]}</legend>
        <Field label={t('name')} name="name" required error={invalid.includes('name')} hint={err('name')}>
          <input id="f-name" name="name" required minLength={2} maxLength={120} autoComplete="name" aria-invalid={invalid.includes('name')} className={inputCls} />
        </Field>
        <Field label={t('company')} name="company">
          <input id="f-company" name="company" maxLength={120} autoComplete="organization" className={inputCls} />
        </Field>
        <Field label={t('phone')} name="phone" required error={invalid.includes('phone')} hint={err('phone', 'phone') ?? t('phoneHint')}>
          <input id="f-phone" name="phone" type="tel" required dir="ltr" autoComplete="tel" placeholder="09xxxxxxxxx" aria-invalid={invalid.includes('phone')} className={`${inputCls} text-start`} />
        </Field>
        <Field label={t('email')} name="email" error={invalid.includes('email')} hint={err('email', 'email')}>
          <input id="f-email" name="email" type="email" dir="ltr" autoComplete="email" aria-invalid={invalid.includes('email')} className={`${inputCls} text-start`} />
        </Field>
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
      </fieldset>

      {state.error && (
        <p className="mt-8 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {t(`errors.${state.error}`)}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted hover:text-primary">
            {t('back')}
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => validateStep() && setStep(step + 1)}
            className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {t('next')}
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pending ? t('sending') : t('submit')}
          </button>
        )}
      </div>
    </form>
  )
}
