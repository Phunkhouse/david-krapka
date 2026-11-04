import type { Dictionary } from './en'

// Czech interface copy. Typed against the English keys, so a missing or
// extra key fails `pnpm typecheck`.
export const cs: Dictionary = {
  site: {
    name: 'David Křapka',
    role: 'Inženýr s produktovým myšlením',
    description:
      'Jsem David Křapka, inženýr s produktovým myšlením. Najdu skutečný problém, postavím produkt a zlepšuji ho i po spuštění.',
  },
  nav: {
    label: 'Hlavní',
    work: 'Práce',
    approach: 'Přístup',
    about: 'O mně',
    contact: 'Kontakt',
  },
  skipLink: 'Přejít na obsah',
  language: {
    label: 'Jazyk',
    en: 'English',
    cs: 'Česky',
  },
  home: {
    // The claim stays in English in the Czech version (design README).
    heading: 'Think. Make. Rethink.',
    placeholder: 'Web se právě staví.',
  },
  notFound: {
    title: 'Stránka nenalezena',
    body: 'Tato stránka neexistuje nebo se přesunula.',
    home: 'Přejít na českou úvodní stránku',
  },
  footer: {
    printed: 'Tištěno třemi barvami: modrou, žlutou a trochou růžové.',
  },
}
