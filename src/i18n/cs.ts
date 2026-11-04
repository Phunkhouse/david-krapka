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
    hero: {
      eyebrow: 'Tak probíhá každý projekt',
      heading: ['Think.', 'Make.', 'Rethink.'],
      // Start of a heading word shown highlighted ("Re" in Rethink).
      highlight: 'Re',
      sublines: [
        'Pochopit problém a položit otázky.',
        'Proměnit to ve fungující produkt.',
        'Poučit se a změnit směr, když to pomůže.',
      ],
      intro:
        'Jsem David Křapka, inženýr s produktovým myšlením. Najdu skutečný problém, postavím produkt a zlepšuji ho i po spuštění.',
      work: 'Prohlédnout práci',
      contact: 'Napište mi',
    },
    work: {
      title: 'Vybraná práce',
      intro:
        'Jeden vlastní produkt od začátku do konce, několik projektů pro klienty a jeden, který ještě vzniká.',
      listLabel: 'Projekty',
      featured: {
        label: 'Hlavní případová studie · Vlastní produkt',
        name: 'Kultomat',
        text: 'Od první otázky k produktu, který běží každý den: problém, rozhodnutí, vývoj a co se změnilo potom.',
        textShort: 'Od první otázky k produktu, který běží každý den.',
        summary: '[Jednovětý souhrn k potvrzení]',
        screenshot: '[Sem přijde snímek Kultomatu]',
        screenshotShort: '[Snímek Kultomatu]',
      },
      projects: [
        {
          name: 'Eucal',
          label: 'Klient · Potřeby firmy',
          text: 'Potřeby firmy převedené do webu, ve kterém se návštěvníci vyznají.',
          textShort:
            'Potřeby firmy převedené do webu, ve kterém se návštěvníci vyznají.',
        },
        {
          name: 'Vladan Vaněk',
          label: 'Klient · Osobní prezentace',
          text: 'Struktura obsahu a osobní prezentace na webu jednotlivce.',
          textShort: 'Struktura obsahu a osobní prezentace.',
        },
        {
          name: 'UpVideo',
          label: 'Klient · Vizuál a multimédia',
          text: 'Vizuální komunikace a video obsah podle zadání klienta.',
          textShort: 'Vizuální komunikace a video podle zadání klienta.',
        },
      ],
      inProgress: {
        name: 'Systerna',
        label: 'Rozpracováno',
        text: 'Právě vzniká. Případová studie přijde, až bude hotový.',
        textShort: 'Právě vzniká. Studie přijde, až bude hotový.',
      },
    },
    approach: {
      title: 'Jak přemýšlím a tvořím',
      intro:
        'Stejné tři otáčky válce u každého projektu, velkého i malého. Dobré produkty začínají dobrými otázkami.',
      introShort:
        'Stejné tři otáčky válce u každého projektu. Dobré produkty začínají dobrými otázkami.',
      listLabel: 'Tři kroky',
      steps: [
        {
          counter: '1/3',
          title: 'Think',
          text: 'Pochopit problém, ptát se a stanovit priority. Pro koho to je a co se stane, když to nepostavíme?',
          textShort: 'Pochopit problém, ptát se a stanovit priority.',
        },
        {
          counter: '2/3',
          title: 'Make',
          text: 'Proměnit záměr ve fungující produkt: UX, implementace, spolupráce a provoz.',
          textShort: 'Proměnit záměr ve fungující produkt a provozovat ho.',
        },
        {
          counter: '3/3',
          title: 'Rethink',
          text: 'Ověřit, poučit se a změnit směr. Zpětná vazba, iterace a věci, které jsem se rozhodl nestavět.',
          textShort: 'Ověřit, poučit se a změnit směr, když to pomůže.',
        },
      ],
      ai: {
        tag: 'AI a já',
        text: 'V práci otevřeně používám nástroje AI. Každá případová studie říká, co jsem zadal, navrhl a rozhodl já, s čím pomohla AI a jak jsem výsledek zkontroloval a otestoval.',
        textShort:
          'Nástroje AI používám otevřeně. Každá studie říká, co jsem rozhodl já, s čím pomohla AI a jak jsem výsledek zkontroloval a otestoval.',
      },
    },
    experience: {
      eyebrow: 'Zkušenosti · Co mi která dala',
      title: 'Velký tým. Malý tým.',
      lessonLabel: 'Co mě to naučilo',
      cv: '[Stáhnout životopis] →',
      emplifi: {
        name: 'Emplifi',
        dates: '[20XX – 20XX]',
        meta: '[Role] · zaměstnání',
        lesson: '[Jak dodávat ve velkém produktu, aniž by se rozbil.]',
        detail: '[Odpovědnosti a jedno konkrétní rozhodnutí, k potvrzení.]',
      },
      freelance: {
        name: 'Freelance',
        dates: '[20XX – dnes]',
        meta: 'Nezávisle · pro klienty',
        lesson: 'Vlastnit celou věc, od první otázky po spuštění.',
        detail: 'Eucal, Vladan Vaněk, UpVideo.',
        link: 'Prohlédnout projekty ↑',
      },
    },
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
