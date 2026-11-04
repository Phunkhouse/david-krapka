import { cs } from './cs'
import { en, type Dictionary } from './en'

export const locales = ['en', 'cs'] as const
export type Locale = (typeof locales)[number]

const dictionaries: Record<Locale, Dictionary> = { en, cs }

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale)
}

/** Interface copy for a locale; falls back to English for unknown values. */
export function t(locale: string | undefined): Dictionary {
  return dictionaries[isLocale(locale) ? locale : 'en']
}
