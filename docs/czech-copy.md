# Czech copy: tone and style

How the Czech texts on the site should read. Approved by David on 19 November 2026, after the Czech case studies were rewritten in this voice. Use it for every new or changed Czech text: case studies (`src/content/case-studies/*/cs.mdx`), the dictionary (`src/i18n/cs.ts`) and anything else a Czech visitor reads.

The Czech version says the same things as the English one: the same facts, numbers, dates and structure. It is not a translation of the English sentences. Write it the way a Czech developer would tell a colleague about their own project.

## The voice

- **First person, David speaking.** "Postavil jsem", "rozhodl jsem", "dívám se na to každé ráno". No "we", no impersonal passive where a person did the work.
- **Spoken, not official.** Plain everyday words, as in a good tech blog post, not a grant application. Natural phrases are fine: "otrava", "střílení naslepo", "aby se dva běhy nepopraly", "vypadá jako skutečná data".
- **Short sentences.** One idea per sentence. Split long chains joined by commas or "a" into two or three sentences. A semicolon can join two closely tied halves.
- **Generic "you" for general truths**, in the second person plural: "Když tarif pozastaví celý web, potřebujete vědět, kolik stojí jedna návštěva." Not "uživatel musí" or "člověk musí".
- **Still precise.** Numbers, dates and claims stay exactly as in the English version. Natural tone never adds a claim the evidence does not support.

## Words

Use the words Czech developers actually use. Common English terms are better than invented Czech ones.

| Use | Instead of |
| --- | --- |
| dashboard (of a provider) | nástěnka |
| skript, skript na Raspberry Pi | sběrač, program pro stahování |
| feed | datový kanál |
| spotřeba (of a quota) | využití |
| průzkum | rešerše |
| ověření proveditelnosti | milník proveditelnosti |
| testovací dotaz | zkušební dotaz |
| přegenerovat stránku | přestavět stránku |
| pull request, lint, unit testy, cron, passkey, dead-man kontrola | (keep in English) |
| akceptační kritéria | akceptační kontroly |
| sáhnout po (Astru) | zvolit (when it reads stiffly) |
| míň, taky, vždycky (now and then, in running text) | méně, také, vždy every time |

Other rules:

- **Names in the product's own language.** When a product's interface is English only (Systerna), keep its screen and label names in English: Overview, Needs attention, Preliminary. When the interface is Czech (Kultomat), use its Czech names: „Doporučeno Kultomatem“, „Pro vás“.
- **Czech number and unit formats:** `93,09`, `2 700`, `88 %`, `14,8 dne`, `12 USD`. Dates as `19. listopadu 2026`.
- **Czech quotation marks** „takto“, never "these" or “these”.
- **The grammatical gender of a product follows its name:** Systerna is feminine („používám ji denně“), Kultomat masculine, a company („firma EUCAL“) feminine.

## Sentence patterns to avoid

Literal translations from English give themselves away. Typical fixes from the November 2026 rewrite:

| Translated | Natural |
| --- | --- |
| Přehled dává nahoru metriky, které potřebují pozornost | Metriky, které potřebují pozornost, jsou hned nahoře |
| 27 z nich proti limitu | z toho 27 má limit |
| Omezení určila všechno | Omezení, která rozhodla o všem |
| Poskytovatelé se číst nechtějí | Poskytovatelé se číst nenechají |
| vezme si zámek, aby se dva běhy nikdy nesrazily | zamkne si to, aby se dva běhy nepopraly |
| ukládá se ve stínovém režimu | potichu se ukládá |
| Neúspěšný sběr ponechá poslední dobrou hodnotu | Když sběr selže, zůstane poslední dobrá hodnota |
| každý pull request jsem proti nim zkontroloval | každý pull request jsem s nimi porovnal |
| platit za víc by byl odhad | platit za víc by bylo střílení naslepo |
| Repozitář běží pod klientovým vlastním účtem | Repozitář je na vlastním GitHub účtu klienta |

Also avoid:

- noun chains: "pravidla poctivosti dat" → "pravidla pro poctivá data";
- "který/která" clauses stacked two deep; split the sentence;
- English word order with the verb at the start of a long sentence;
- "realizovat", "zajistit", "v rámci" and other office words.

## Component fields

The case study components put a Czech label before each field, so each value must read well after it:

- `Zvolil jsem:` an infinitive or a noun phrase ("Ukládat každou projekci…").
- `Místo:` a noun phrase or an infinitive in the nominative ("Ruční zadávání jako záchrana…", "Mít všechny klíče…").
- `Protože:` full sentences.
- `Ověřil jsem:` full sentences about what shows it works.
- `S čím pomohla AI:` starts with "S …" ("S většinou kódu a testů…").

## Before publishing

- Read the Czech text aloud once. If a sentence needs a breath in the middle, split it.
- Check it against the English version: same facts, nothing added, nothing dropped.
- Run `pnpm check:fonts` after a build (with `SHOW_DRAFTS=1` for a draft) in case the new copy uses a character the site fonts lack.
