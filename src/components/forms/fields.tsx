'use client'

import { useState, type ReactNode } from 'react'
import type { Option } from '@/lib/options'

// فیلدهای فرم با ظاهر یکسان (برای همه‌ی فرم‌های سایت)

export const inputCls =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-muted/60 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-500'

type FieldProps = { label: string; name: string; required?: boolean; hint?: string; error?: boolean; children?: ReactNode }

export function Field({ label, name, required, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={`f-${name}`} className="mb-2 block text-sm font-semibold">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
      {hint && (
        <p className={`mt-1.5 text-xs ${error ? 'text-red-500' : 'text-muted'}`} role={error ? 'alert' : undefined}>
          {hint}
        </p>
      )}
    </div>
  )
}

type SelectOtherProps = {
  label: string
  name: string
  options: Option[]
  locale: 'fa' | 'en'
  required?: boolean
  placeholder: string
  otherPlaceholder: string
  defaultValue?: string
  invalid?: string[]
  errorText: string
}

/** انتخاب از فهرست + کادر متنی وقتی «سایر» انتخاب شود */
export function SelectWithOther({
  label,
  name,
  options,
  locale,
  required,
  placeholder,
  otherPlaceholder,
  defaultValue = '',
  invalid = [],
  errorText,
}: SelectOtherProps) {
  const [value, setValue] = useState(defaultValue)
  const bad = invalid.includes(name)
  const badOther = invalid.includes(`${name}Other`)
  return (
    <Field label={label} name={name} required={required} error={bad || badOther} hint={bad || badOther ? errorText : undefined}>
      <select
        id={`f-${name}`}
        name={name}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={bad}
        className={inputCls}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label[locale]}
          </option>
        ))}
      </select>
      {value === 'other' && (
        <input
          name={`${name}Other`}
          required
          maxLength={120}
          placeholder={otherPlaceholder}
          aria-label={`${label}: ${otherPlaceholder}`}
          aria-invalid={badOther}
          className={`${inputCls} mt-2`}
        />
      )}
    </Field>
  )
}
