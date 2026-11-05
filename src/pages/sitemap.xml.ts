import type { APIRoute } from 'astro'
import { getCaseStudies } from '../content/load'
import { locales } from '../i18n'
import { alternatesFor, routes, urlFor, type RouteKey } from '../i18n/routes'

// Every page in both languages, with hreflang alternates (decision 5 in the
// milestone 6 checklist). Case studies come from the same helper as their
// routes, so a draft is listed only in builds that also build its page.
export const GET: APIRoute = async () => {
  const studies = await getCaseStudies('en')
  const keys: RouteKey[] = [
    ...(Object.keys(routes) as (keyof typeof routes)[]),
    ...studies.map((study) => `work/${study.slug}` as const),
  ]

  const entries = keys.flatMap((route) => {
    const links = [
      ...alternatesFor(route).map(
        ({ locale, href }) =>
          `    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('en', route)}"/>`,
    ].join('\n')
    return locales.map(
      (locale) =>
        `  <url>\n    <loc>${urlFor(locale, route)}</loc>\n${links}\n  </url>`,
    )
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
