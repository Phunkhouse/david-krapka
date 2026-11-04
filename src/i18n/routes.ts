import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n'
import { locales, type Locale } from './index'

/**
 * Every page that exists in both languages, by key. Paths are the same in
 * both languages (decision 0005); the locale prefix comes from Astro i18n.
 * The language switcher, hreflang alternates and the sitemap use this map.
 */
export const routes = {
  home: '',
  privacy: 'privacy',
} as const

export type RouteKey = keyof typeof routes

export function pathFor(locale: Locale, route: RouteKey): string {
  return getRelativeLocaleUrl(locale, routes[route])
}

export function urlFor(locale: Locale, route: RouteKey): string {
  return getAbsoluteLocaleUrl(locale, routes[route])
}

export function alternatesFor(route: RouteKey) {
  return locales.map((locale) => ({
    locale,
    href: urlFor(locale, route),
  }))
}
