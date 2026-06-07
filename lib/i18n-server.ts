import { cookies } from 'next/headers'
import { Locale } from './i18n'

export function getLocale(): Locale {
  try {
    const cookieStore = cookies()
    const val = cookieStore.get('lang')?.value
    if (val === 'en' || val === 'my') return val
    return 'en'
  } catch {
    return 'en'
  }
}
