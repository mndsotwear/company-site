import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/** نمایش متن ویرایشگر پنل با استایل‌های .rich در globals.css */
export function RichText({ data, className = '' }: { data: unknown; className?: string }) {
  if (!data) return null
  return <LexicalRichText data={data as SerializedEditorState} className={`rich ${className}`} />
}
