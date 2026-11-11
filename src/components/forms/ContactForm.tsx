'use client'

import { startTransition, useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import { submitContact, type ContactState } from '@/app/(frontend)/[locale]/contact/actions'
import { Field, inputCls } from './fields'

const initial: ContactState = { ok: false }

// فرم پیام در صفحه‌ی «تماس با ما»
export function ContactForm() {
  const t = useTranslations('contactForm')
  const [state, action, pending] = useActionState(submitContact, initial)
  const [startedAt] = useState(() => Date.now())
  const invalid = state.fields || []
  const err = (name: string) => (invalid.includes(name) ? t(`errors.${name}`) : undefined)

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8" role="status">
        <p className="text-sm text-primary">{t('success.eyebrow')}</p>
        <p className="mt-3 text-2xl font-extrabold">{t('success.title')}</p>
        <p className="mt-3 leading-8 text-muted">{t('success.text')}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(() => action(fd))
      }}
      className="relative grid gap-6 sm:grid-cols-2"
    >
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
      <Field label={t('subject')} name="subject">
        <input id="f-subject" name="subject" maxLength={160} className={inputCls} />
      </Field>
      <Field label={t('phone')} name="phone" error={invalid.includes('phone')} hint={err('phone')}>
        <input id="f-phone" name="phone" type="tel" dir="ltr" autoComplete="tel" placeholder="09xxxxxxxxx" aria-invalid={invalid.includes('phone')} className={`${inputCls} text-start`} />
      </Field>
      <Field label={t('email')} name="email" error={invalid.includes('email')} hint={err('email')}>
        <input id="f-email" name="email" type="email" dir="ltr" autoComplete="email" aria-invalid={invalid.includes('email')} className={`${inputCls} text-start`} />
      </Field>
      <div className="sm:col-span-2">
        <Field label={t('message')} name="message" required error={invalid.includes('message')} hint={err('message')}>
          <textarea id="f-message" name="message" required rows={5} maxLength={3000} aria-invalid={invalid.includes('message')} className={inputCls} />
        </Field>
      </div>
      <p className="text-xs text-muted sm:col-span-2">{t('contactHint')}</p>
      {state.error && state.error !== 'invalid' && (
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
