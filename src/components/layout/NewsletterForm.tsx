'use client'

import { startTransition, useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import { subscribe, type NewsletterState } from '@/lib/newsletter'

const initial: NewsletterState = { ok: false }

// فرم عضویت خبرنامه در فوتر
export function NewsletterForm() {
  const t = useTranslations('newsletter')
  const [state, action, pending] = useActionState(subscribe, initial)
  const [startedAt] = useState(() => Date.now())
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-foam/45">{t('title')}</p>
      <p className="mt-3 text-sm leading-7 text-foam/70">{t('text')}</p>
      {state.ok ? (
        <p className="mt-4 text-sm font-semibold text-foam" role="status">
          {t('ok')}
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            startTransition(() => action(fd))
          }}
          className="mt-4 flex gap-2"
        >
          <input type="hidden" name="_t" value={startedAt} />
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <label className="sr-only" htmlFor="nl-email">
            {t('placeholder')}
          </label>
          <input
            id="nl-email"
            name="email"
            type="email"
            required
            dir="ltr"
            placeholder={t('placeholder')}
            className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-foam placeholder:text-foam/40 focus:border-white/60 focus:outline-none"
          />
          <button type="submit" disabled={pending} className="rounded-full bg-foam px-5 text-sm font-semibold text-navy transition hover:bg-primary hover:text-white disabled:opacity-60">
            {t('button')}
          </button>
        </form>
      )}
      {state.error && (
        <p className="mt-2 text-xs text-red-300" role="alert">
          {t(state.error)}
        </p>
      )}
    </div>
  )
}
