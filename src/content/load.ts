import { getCollection, type CollectionEntry } from 'astro:content'
import { isLocale, locales, type Locale } from '../i18n'

export type CaseStudy = CollectionEntry<'caseStudies'> & {
  /** Project slug: the folder name, also the last URL segment. */
  slug: string
  locale: Locale
}

/**
 * Drafts are shown by the dev server, built when `SHOW_DRAFTS=1`, and built on
 * Cloudflare Workers Builds for every branch except `main`
 * (`WORKERS_CI_BRANCH`), so previews can show unfinished case studies while
 * production never does.
 */
export function draftsVisible(env: NodeJS.ProcessEnv = process.env): boolean {
  if (import.meta.env.DEV) return true
  if (env.SHOW_DRAFTS === '1') return true
  const branch = env.WORKERS_CI_BRANCH
  return Boolean(branch) && branch !== 'main'
}

function parse(entry: CollectionEntry<'caseStudies'>): CaseStudy {
  const [slug, locale, ...rest] = entry.id.split('/')
  if (!slug || !isLocale(locale) || rest.length > 0) {
    throw new Error(
      `Case study "${entry.id}" must be at <project>/<language>.mdx with a language of ${locales.join(' or ')}.`,
    )
  }
  return { ...entry, slug, locale }
}

/**
 * Every case study entry, all languages. Fails the build when a project is
 * missing a language or its languages disagree about being a draft, so a
 * visitor never meets a half-translated project.
 */
async function loadAll(): Promise<CaseStudy[]> {
  const all = (await getCollection('caseStudies')).map(parse)
  const slugs = [...new Set(all.map((study) => study.slug))]
  for (const slug of slugs) {
    const versions = all.filter((study) => study.slug === slug)
    const missing = locales.filter(
      (locale) => !versions.some((study) => study.locale === locale),
    )
    if (missing.length > 0) {
      throw new Error(
        `Case study "${slug}" has no ${missing.join(' or ')} version. Add it, or delete the project.`,
      )
    }
    if (new Set(versions.map((study) => study.data.draft)).size > 1) {
      throw new Error(
        `Case study "${slug}" is a draft in one language and published in another.`,
      )
    }
  }
  for (const locale of locales) {
    const orders = all
      .filter((study) => study.locale === locale)
      .map((study) => study.data.order)
    const repeated = orders.find((order, i) => orders.indexOf(order) !== i)
    if (repeated !== undefined) {
      throw new Error(
        `Two case studies share order ${repeated} (${locale}); "Next project" needs a unique order.`,
      )
    }
  }
  return all
}

/** Case studies to build in a language, in "Next project" order. */
export async function getCaseStudies(locale: Locale): Promise<CaseStudy[]> {
  const showDrafts = draftsVisible()
  return (await loadAll())
    .filter(
      (study) => study.locale === locale && (showDrafts || !study.data.draft),
    )
    .sort((a, b) => a.data.order - b.data.order)
}

/**
 * The case study after this one in "Next project" order, wrapping around.
 * Undefined when this is the only one built.
 */
export async function nextCaseStudy(
  study: CaseStudy,
): Promise<CaseStudy | undefined> {
  const studies = await getCaseStudies(study.locale)
  if (studies.length < 2) return undefined
  const index = studies.findIndex((other) => other.slug === study.slug)
  return studies[(index + 1) % studies.length]
}
