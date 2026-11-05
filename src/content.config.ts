import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/**
 * Case studies: one folder per project, one file per language
 * (`kultomat/en.mdx`, `kultomat/cs.mdx`). The file path gives the project
 * slug and the language; src/content/load.ts checks that both languages exist.
 *
 * Every field below except `stack` and `liveUrl` is required, so a case study
 * cannot be published without its role, collaborators and AI share (SPEC,
 * "Content honesty"). While a fact is unconfirmed, write it as a `[…]`
 * placeholder: `pnpm placeholders` lists it and the production check rejects it.
 */
const caseStudies = defineCollection({
  loader: glob({ base: './src/content/case-studies', pattern: '**/*.mdx' }),
  schema: ({ image }) =>
    z.object({
      /** Page title and H1. */
      title: z.string().min(1),
      /** One sentence: meta description and social preview text. */
      summary: z.string().min(1),
      /** `long` for the in-depth story, `short` for client projects. */
      kind: z.enum(['long', 'short']),
      /** Where the project stands today. */
      status: z.string().min(1),
      /** When David worked on it. */
      dates: z.string().min(1),
      /** David's role and scope. */
      role: z.string().min(1),
      /** Other people who worked on it; an empty list means nobody else. */
      collaborators: z.array(
        z.object({ name: z.string().min(1), role: z.string().min(1) }),
      ),
      /** What AI helped with and how the result was reviewed. */
      ai: z.string().min(1),
      stack: z.array(z.string().min(1)).optional(),
      liveUrl: z.url().optional(),
      /** Position in the "Next project" order. */
      order: z.number().int(),
      /**
       * Unpublished. Drafts are built only on preview branches (see
       * src/content/load.ts) and never on main.
       */
      draft: z.boolean(),
      /**
       * Social preview image (1200 × 630), exported from the canvas template
       * `OG-Case`, next to the MDX file. Without it the page has no og:image.
       */
      ogImage: image().optional(),
    }),
})

export const collections = { caseStudies }
