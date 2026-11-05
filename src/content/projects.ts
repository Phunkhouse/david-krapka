import { t, type Locale } from '../i18n'

/** Card art per project, shared by the case study header and "Next project". */
export type ArtKind = 'k' | 'circle' | 'paper' | 'play'

const art: Record<string, { letter: string; kind: ArtKind }> = {
  kultomat: { letter: 'K', kind: 'k' },
  eucal: { letter: 'E', kind: 'circle' },
  'vladan-vanek': { letter: 'V', kind: 'paper' },
  upvideo: { letter: 'U', kind: 'play' },
}

export function artFor(slug: string) {
  const found = art[slug]
  if (!found) {
    throw new Error(
      `No card art for project "${slug}" in src/content/projects.ts.`,
    )
  }
  return found
}

/** The landing card's label, name and text for a project. */
export function cardFor(locale: Locale, slug: string) {
  const { featured, projects } = t(locale).home.work
  const card =
    featured.slug === slug
      ? featured
      : projects.find((project) => project.slug === slug)
  if (!card) {
    throw new Error(`No landing card for project "${slug}" (${locale}).`)
  }
  return { label: card.label, name: card.name, text: card.text }
}
