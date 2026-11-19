import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n'
import { locales, t, type Locale } from './index'

/**
 * Every page that exists in both languages, by key. Paths are the same in
 * both languages (decision 0005); the locale prefix comes from Astro i18n.
 * The language switcher, hreflang alternates and the sitemap use this map.
 */
export const routes = {
  home: '',
  privacy: 'privacy',
} as const

type StaticRoute = keyof typeof routes

/** A static page, or a case study (`work/<slug>`, same path in both languages). */
export type RouteKey = StaticRoute | `work/${string}`

function pathOf(route: RouteKey): string {
  return Object.hasOwn(routes, route) ? routes[route as StaticRoute] : route
}

export function pathFor(locale: Locale, route: RouteKey): string {
  return getRelativeLocaleUrl(locale, pathOf(route))
}

export function urlFor(locale: Locale, route: RouteKey): string {
  return getAbsoluteLocaleUrl(locale, pathOf(route))
}

export function alternatesFor(route: RouteKey) {
  return locales.map((locale) => ({
    locale,
    href: urlFor(locale, route),
  }))
}

/**
 * The landing page sections, in page order, for the header and footer
 * navigation. Each id must match the section's `id` on the landing page.
 */
export function sectionLinks(locale: Locale) {
  const { nav } = t(locale)
  const home = pathFor(locale, 'home')
  return (['work', 'approach', 'about', 'contact'] as const).map((id) => ({
    id,
    href: `${home}#${id}`,
    label: nav[id],
  }))
}
