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
  menu: {
    open: 'Otevřít menu',
    close: 'Zavřít menu',
    fallback: 'Menu',
    cta: 'Začít projekt →',
  },
  skipLink: 'Přejít na obsah',
  language: {
    label: 'Jazyk',
    en: 'English',
    cs: 'Česky',
  },
  pause: {
    stop: 'Zastavit tisk',
    start: 'Spustit tisk',
  },
  home: {
    // The claim stays in English in the Czech version (design README).
    heading: 'Think. Make. Rethink.',
    placeholder: 'Web se právě staví.',
  },
  privacy: {
    title: 'Ochrana osobních údajů',
    description: 'Jak tento web zachází s osobními údaji.',
    placeholder:
      '[Informace o zpracování osobních údajů se připravují a budou zveřejněny před spuštěním webu.]',
  },
  notFound: {
    title: 'Stránka nenalezena',
    body: 'Tato stránka neexistuje nebo se přesunula.',
    home: 'Přejít na českou úvodní stránku',
  },
  footer: {
    navLabel: 'Patička',
    privacy: 'Soukromí',
    printed: 'Tištěno třemi barvami: modrou, žlutou a trochou růžové.',
  },
}
