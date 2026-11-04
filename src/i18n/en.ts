// English interface copy. This file defines the keys; cs.ts must match it.
export const en = {
  site: {
    name: 'David Křapka',
    role: 'Product-minded engineer',
    description:
      "I'm David Křapka, a product-minded engineer. I find the real problem, build the product and keep improving it after it ships.",
  },
  nav: {
    label: 'Main',
    work: 'Work',
    approach: 'Approach',
    about: 'About',
    contact: 'Contact',
  },
  menu: {
    open: 'Open menu',
    close: 'Close menu',
    // Fallback link without JavaScript: jumps to the footer navigation.
    fallback: 'Menu',
    // An invitation to talk only (LEG-001, decision 0008).
    cta: 'Start a project →',
  },
  skipLink: 'Skip to content',
  language: {
    label: 'Language',
    en: 'English',
    cs: 'Česky',
  },
  pause: {
    stop: 'Stop the press',
    start: 'Start the press',
  },
  home: {
    heading: 'Think. Make. Rethink.',
    placeholder: 'This site is being built.',
  },
  privacy: {
    title: 'Privacy notice',
    description: 'How this site handles personal data.',
    // Square brackets: the milestone 6 build check fails while this remains.
    placeholder:
      '[The privacy notice is being prepared and will be published before launch.]',
  },
  notFound: {
    title: 'Page not found',
    body: 'This page does not exist or has moved.',
    home: 'Go to the English home page',
  },
  footer: {
    navLabel: 'Footer',
    privacy: 'Privacy',
    printed: 'Printed in three inks: blue, yellow and a little pink.',
  },
}

export type Dictionary = typeof en
