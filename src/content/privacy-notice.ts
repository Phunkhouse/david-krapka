// The privacy notice (LEG-003), one text per language. Plain language, first
// person. In paragraphs and list items, `{email}` becomes the public contact
// address and `[label](https://…)` an external link; nothing else is markup.
// Every claim here must stay true of the site: if analytics, forms, cookies or
// a new supplier arrive, change this text first (docs/SPEC.md, LEG-003/005).
import type { Locale } from '../i18n'

export interface NoticeSection {
  id: string
  heading: string
  paragraphs: string[]
  list?: string[]
}

export interface Notice {
  /** Machine-readable date of the last change (YYYY-MM-DD). */
  updated: string
  /** The same date as shown. */
  updatedText: string
  updatedLabel: string
  intro: string
  sections: NoticeSection[]
}

const cloudflarePolicy = 'https://www.cloudflare.com/privacypolicy/'
const cloudflareDpa = 'https://www.cloudflare.com/cloudflare-customer-dpa/'
const authority = 'https://uoou.gov.cz/'
const adequacy =
  'https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en'

const en: Notice = {
  updated: '2026-11-09',
  updatedText: '9 November 2026',
  updatedLabel: 'Last updated',
  intro:
    'This site is a personal portfolio, built to collect as little as possible. It has no forms, accounts, analytics, advertising or cookies, and it loads no third-party scripts, fonts or embeds.',
  sections: [
    {
      id: 'who',
      heading: 'Who is responsible',
      paragraphs: [
        'I am David Křapka, a natural person in the Czech Republic. I decide why and how the personal data described here is used (in data protection terms, I am the controller).',
        'Contact: [{email}](mailto:{email}). Questions about this notice and requests about your data go there.',
      ],
    },
    {
      id: 'device',
      heading: 'What stays on your device',
      paragraphs: [
        'Nothing. The site sets no cookies and uses no local storage, session storage or IndexedDB, so there is no cookie banner. Whether you paused the animations is not remembered between visits.',
      ],
    },
    {
      id: 'visits',
      heading: 'When you visit the site',
      paragraphs: [
        'The site is hosted by Cloudflare. When your browser loads a page, Cloudflare receives the technical data every browser sends: your IP address, the page you asked for, the date and time, and details of your browser and device (the user agent). Cloudflare needs this to deliver the page and to protect its network and this site from abuse.',
        'I do not receive, store or analyse these records, and I cannot identify individual visitors from them. The site has no logging or analytics of its own.',
        'Purpose and legal basis: running a working and secure website, which is my legitimate interest (Article 6(1)(f) GDPR). Cloudflare acts as my processor under the data processing addendum that forms part of my agreement with it ([data processing addendum](' +
          cloudflareDpa +
          ')). Its [privacy policy](' +
          cloudflarePolicy +
          ') also says that Cloudflare is the controller of some data it collects to run its network; for that use Cloudflare decides the purposes itself and is responsible for it.',
        'How long: Cloudflare controls how long it keeps this data. Its privacy policy gives no fixed period, only that it keeps personal information for a time consistent with its business purposes, and I have no setting to change that.',
      ],
    },
    {
      id: 'messages',
      heading: 'When you write to me',
      paragraphs: [
        'If you email {email}, I receive your email address, your name if you give it, and what you write. I use it to read and answer your message and to keep a record of the conversation. The legal basis is my legitimate interest in answering people who contact me; if you write about a job or a project, it is also taking steps at your request before a possible agreement.',
        'Your message passes through my email hosting provider, which forwards {email} to a mailbox with Proton in Switzerland, where I read it. I keep a conversation for as long as it is useful and delete it twelve months after the last message, unless the law or a dispute requires me to keep it longer. I send no newsletters or marketing and I do not put you on any list.',
      ],
    },
    {
      id: 'people',
      heading: 'People named in my work',
      paragraphs: [
        'Case studies may name clients and collaborators and show people in screenshots of projects I worked on. I publish this to present my work honestly, which is my legitimate interest, and I keep it for as long as the case study is published. If you are named or shown and want it changed or removed, write to [{email}](mailto:{email}) and I will act on it promptly.',
      ],
    },
    {
      id: 'recipients',
      heading: 'Who receives data, and transfers outside the EU',
      paragraphs: [
        'Recipients are Cloudflare (hosting) and my email providers (messages). I do not sell data, and I use none of it for automated decisions or profiling.',
        'Cloudflare is a US company and may process data outside the European Economic Area. It transfers data under the EU–US Data Privacy Framework or, where that does not apply, under the EU standard contractual clauses, which its data processing addendum includes.',
        'Email sent to the published address ends up with Proton in Switzerland. Switzerland is outside the European Economic Area, but the European Commission recognises it as providing an adequate level of data protection ([adequacy decisions](' +
          adequacy +
          ')), so that transfer needs no further safeguard.',
      ],
    },
    {
      id: 'rights',
      heading: 'Your rights',
      paragraphs: ['You have the right to:'],
      list: [
        'ask for a copy of your personal data and for information about how it is used (access);',
        'have wrong data corrected (rectification);',
        'have your data deleted (erasure);',
        'have its use restricted;',
        'object to its use on the basis of my legitimate interests;',
        'receive data you gave me in a common format, where that applies (portability).',
      ],
    },
    {
      id: 'exercise',
      heading: 'How to use your rights, and complain',
      paragraphs: [
        'Write to [{email}](mailto:{email}). I answer within one month. Because I cannot identify visitors in Cloudflare’s records, I may not be able to find data about your visit there; Cloudflare’s [privacy policy](' +
          cloudflarePolicy +
          ') explains how to contact Cloudflare.',
        'You can also complain to the Czech data protection authority, the [Úřad pro ochranu osobních údajů](' +
          authority +
          ') (ÚOOÚ), Pplk. Sochora 27, 170 00 Praha 7, or to the authority in the EU country where you live or work.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes',
      paragraphs: [
        'If this changes, for example because analytics or a form is added, I will update this page and its date before the change takes effect.',
      ],
    },
  ],
}

const cs: Notice = {
  updated: '2026-11-09',
  updatedText: '9. listopadu 2026',
  updatedLabel: 'Poslední aktualizace',
  intro:
    'Tento web je osobní portfolio a shromažďuje co nejméně údajů. Nemá formuláře, účty, analytiku, reklamu ani cookies a nenačítá skripty, písma ani vložený obsah třetích stran.',
  sections: [
    {
      id: 'who',
      heading: 'Kdo za web odpovídá',
      paragraphs: [
        'Jsem David Křapka, fyzická osoba v České republice. Rozhoduji o tom, proč a jak se zde popsané osobní údaje používají (z pohledu ochrany osobních údajů jsem správce).',
        'Kontakt: [{email}](mailto:{email}). Sem patří dotazy k tomuto textu i žádosti týkající se vašich údajů.',
      ],
    },
    {
      id: 'device',
      heading: 'Co zůstává ve vašem zařízení',
      paragraphs: [
        'Nic. Web nenastavuje žádné cookies a nepoužívá local storage, session storage ani IndexedDB, proto nemá cookie lištu. Zda jste animace pozastavili, se mezi návštěvami nepamatuje.',
      ],
    },
    {
      id: 'visits',
      heading: 'Když web navštívíte',
      paragraphs: [
        'Web hostuje Cloudflare. Když váš prohlížeč načte stránku, Cloudflare obdrží technické údaje, které posílá každý prohlížeč: vaši IP adresu, požadovanou stránku, datum a čas a informace o prohlížeči a zařízení (user agent). Cloudflare je potřebuje, aby stránku doručil a ochránil svou síť i tento web před zneužitím.',
        'Tyto záznamy nedostávám, neukládám ani nevyhodnocuji a z jejich obsahu nedokážu poznat jednotlivé návštěvníky. Web sám nemá žádné logování ani analytiku.',
        'Účel a právní základ: provoz fungujícího a zabezpečeného webu, tedy můj oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR). Cloudflare je můj zpracovatel na základě dodatku o zpracování osobních údajů, který je součástí mé smlouvy s ním ([dodatek o zpracování osobních údajů](' +
          cloudflareDpa +
          ')). Jeho [zásady ochrany osobních údajů](' +
          cloudflarePolicy +
          ') zároveň uvádějí, že Cloudflare je správcem části údajů, které shromažďuje při provozu své sítě; k tomuto účelu určuje Cloudflare cíle sám a sám za ně odpovídá.',
        'Jak dlouho: dobu uložení určuje Cloudflare. Jeho zásady neuvádějí pevnou lhůtu, jen že osobní údaje uchovává po dobu odpovídající jeho obchodním účelům, a já nemám žádné nastavení, jak to změnit.',
      ],
    },
    {
      id: 'messages',
      heading: 'Když mi napíšete',
      paragraphs: [
        'Napíšete-li na {email}, dostanu vaši e-mailovou adresu, jméno, pokud ho uvedete, a obsah zprávy. Použiji je k přečtení a zodpovězení zprávy a k uchování záznamu o konverzaci. Právním základem je můj oprávněný zájem odpovídat lidem, kteří mě kontaktují; pokud píšete kvůli práci nebo projektu, jde zároveň o kroky učiněné na vaši žádost před případnou smlouvou.',
        'Vaše zpráva projde přes poskytovatele e-mailového hostingu mé domény, který adresu {email} přeposílá do schránky u společnosti Proton ve Švýcarsku, kde ji čtu. Konverzaci uchovávám, dokud je užitečná, a dvanáct měsíců po poslední zprávě ji smažu, pokud mi zákon nebo spor neukládá ji uchovat déle. Nerozesílám newslettery ani marketing a nezařazuji vás do žádného seznamu.',
      ],
    },
    {
      id: 'people',
      heading: 'Lidé zmínění v mé práci',
      paragraphs: [
        'Případové studie mohou uvádět jména klientů a spolupracovníků a ukazovat lidi na snímcích obrazovky projektů, na kterých jsem pracoval. Zveřejňuji to, abych svou práci představil pravdivě, což je můj oprávněný zájem, a uchovávám to, dokud je případová studie zveřejněná. Pokud jste uvedeni nebo zobrazeni a chcete to změnit nebo odstranit, napište na [{email}](mailto:{email}) a vyřídím to bez zbytečného odkladu.',
      ],
    },
    {
      id: 'recipients',
      heading: 'Kdo údaje dostává a předání mimo EU',
      paragraphs: [
        'Příjemci jsou Cloudflare (hosting) a poskytovatelé mého e-mailu (zprávy). Údaje neprodávám a nepoužívám je k automatizovanému rozhodování ani profilování.',
        'Cloudflare je americká společnost a může údaje zpracovávat mimo Evropský hospodářský prostor. Předává je na základě rámce EU–USA pro ochranu údajů (Data Privacy Framework), a pokud se nepoužije, na základě standardních smluvních doložek EU, které jeho dodatek o zpracování osobních údajů obsahuje.',
        'E-mail poslaný na zveřejněnou adresu skončí u společnosti Proton ve Švýcarsku. Švýcarsko leží mimo Evropský hospodářský prostor, ale Evropská komise uznává, že zajišťuje odpovídající úroveň ochrany osobních údajů ([rozhodnutí o odpovídající ochraně](' +
          adequacy +
          ')), takže pro toto předání nejsou potřeba další záruky.',
      ],
    },
    {
      id: 'rights',
      heading: 'Vaše práva',
      paragraphs: ['Máte právo:'],
      list: [
        'požádat o kopii svých osobních údajů a informace o tom, jak se používají (přístup);',
        'nechat opravit nesprávné údaje (oprava);',
        'nechat své údaje vymazat (výmaz);',
        'omezit jejich zpracování;',
        'vznést námitku proti zpracování založenému na mém oprávněném zájmu;',
        'získat údaje, které jste mi poskytli, v běžném formátu, pokud se to na ně vztahuje (přenositelnost).',
      ],
    },
    {
      id: 'exercise',
      heading: 'Jak svá práva uplatnit a kam si stěžovat',
      paragraphs: [
        'Napište na [{email}](mailto:{email}). Odpovím do jednoho měsíce. Protože v záznamech Cloudflare návštěvníky identifikovat nedokážu, údaje o vaší návštěvě tam nemusím být schopen dohledat; jak Cloudflare kontaktovat, vysvětlují jeho [zásady ochrany osobních údajů](' +
          cloudflarePolicy +
          ').',
        'Můžete si také stěžovat u českého dozorového úřadu, [Úřadu pro ochranu osobních údajů](' +
          authority +
          ') (ÚOOÚ), Pplk. Sochora 27, 170 00 Praha 7, nebo u úřadu v zemi EU, kde žijete nebo pracujete.',
      ],
    },
    {
      id: 'changes',
      heading: 'Změny',
      paragraphs: [
        'Pokud se to změní, například přidáním analytiky nebo formuláře, upravím tuto stránku a její datum dříve, než změna začne platit.',
      ],
    },
  ],
}

export const notices: Record<Locale, Notice> = { en, cs }
