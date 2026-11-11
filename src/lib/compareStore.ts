'use client'

// لیست کشتی‌های انتخاب‌شده برای مقایسه (حداکثر ۳)، در حافظه‌ی مرورگر همین بازدیدکننده
export type CompareItem = { slug: string; name: string }
const KEY = 'shahin-compare'
export const COMPARE_MAX = 3
const EVENT = 'shahin-compare-change'

export function readCompare(): CompareItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v.slice(0, COMPARE_MAX) : []
  } catch {
    return []
  }
}

export function writeCompare(items: CompareItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, COMPARE_MAX)))
  } catch {
    // حالت خصوصی مرورگر: فقط در همین صفحه بماند
  }
  window.dispatchEvent(new Event(EVENT))
}

export function onCompareChange(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}
