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
    hero: {
      eyebrow: 'How every project goes',
      // The claim stays in English in the Czech version (design README).
      heading: ['Think.', 'Make.', 'Rethink.'],
      // Start of a heading word shown highlighted ("Re" in Rethink).
      highlight: 'Re',
      sublines: [
        'Understand the problem and ask the questions.',
        'Turn it into a working product.',
        'Learn from it and change direction when it helps.',
      ],
      intro:
        "I'm David Křapka, a product-minded engineer. I find the real problem, build the product and keep improving it after it ships.",
      work: 'See selected work',
      contact: 'Get in touch',
    },
    work: {
      title: 'Selected work',
      intro:
        'One product I own end to end, a few client projects, and one that is still being built.',
      listLabel: 'Projects',
      readMore: 'Read the case study →',
      featured: {
        label: 'Main case study · Own product',
        slug: 'kultomat',
        name: 'Kultomat',
        text: 'From the first question to a product that runs every day: the problem, the decisions, the build and what changed afterwards.',
        textShort: 'From the first question to a product that runs every day.',
        // Square brackets: the milestone 6 build check fails while these remain.
        summary: '[One-line summary to be confirmed]',
      },
      projects: [
        {
          slug: 'eucal',
          name: 'Eucal',
          label: 'Client · Business needs',
          text: 'Turning business needs into a website visitors can find their way through.',
          textShort:
            'Business needs turned into a website visitors can find their way through.',
        },
        {
          slug: 'vladan-vanek',
          name: 'Vladan Vaněk',
          label: 'Client · Personal identity',
          text: "Content structure and personal presentation for an individual's website.",
          textShort: 'Content structure and personal presentation.',
        },
        {
          slug: 'upvideo',
          name: 'UpVideo',
          label: 'Client · Visual & multimedia',
          text: 'Visual communication and video content delivered against a client brief.',
          textShort: 'Visual communication and video against a client brief.',
        },
      ],
      inProgress: {
        name: 'Systerna',
        label: 'In progress',
        text: "Being built now. The case study comes when it's ready.",
        textShort: "Being built now. Case study when it's ready.",
      },
    },
    // Each `*Short` text is the mobile version of the one above it: keep them
    // saying the same thing (the mockups use a shorter wording on mobile).
    approach: {
      title: 'How I think & build',
      intro:
        'The same three turns of the drum on every project, big or small. Good products start with good questions.',
      introShort:
        'The same three turns of the drum on every project. Good products start with good questions.',
      listLabel: 'Three steps',
      // Titles stay in English in Czech: they match the hero claim.
      steps: [
        {
          counter: '1/3',
          title: 'Think',
          text: "Understand the problem, ask the questions and choose priorities. Who is this for, and what happens if we don't build it?",
          textShort:
            'Understand the problem, ask the questions and choose priorities.',
        },
        {
          counter: '2/3',
          title: 'Make',
          text: 'Turn the intention into a working product: UX, implementation, collaboration and running it in production.',
          textShort: 'Turn the intention into a working product and run it.',
        },
        {
          counter: '3/3',
          title: 'Rethink',
          text: 'Validate, learn and change direction. Feedback, iteration, and the things I chose not to build.',
          textShort: 'Validate, learn and change direction when it helps.',
        },
      ],
      ai: {
        tag: 'AI + me',
        text: 'I use AI tools in my work, openly. Each case study says what I specified, designed and decided, what AI helped with, and how I reviewed and tested the result.',
        textShort:
          'I use AI tools openly. Each case study says what I decided, what AI helped with, and how I reviewed and tested the result.',
      },
    },
    experience: {
      eyebrow: 'Experience · What each one taught me',
      title: 'Big team. Small team.',
      lessonLabel: 'What it taught me',
      // Square brackets: the milestone 6 build check fails while these remain.
      cv: '[Download CV] →',
      emplifi: {
        name: 'Emplifi',
        dates: '[20XX – 20XX]',
        meta: '[Role] · employed',
        lesson: '[How to ship inside a big product without breaking it.]',
        detail: '[Responsibilities and one concrete decision, to confirm.]',
      },
      freelance: {
        name: 'Freelance',
        dates: '[20XX – now]',
        meta: 'Independent · for clients',
        lesson: 'Owning the whole thing, from the first question to launch.',
        detail: 'Eucal, Vladan Vaněk, UpVideo.',
        link: 'See the projects ↑',
      },
    },
    about: {
      eyebrow: 'About · Always evolving',
      // Highlighted word in the middle.
      title: ['Playful by design. ', 'Serious', ' about the work.'],
      text: 'The way I work has changed a lot. I used to work on parts of a product. Now I take on more of the whole thing, combining product thinking, UX and engineering.',
      // Square brackets: the milestone 6 build check fails while this remains.
      note: '[A short personal note goes here.]',
      portrait: 'Portrait of David Křapka',
    },
    contact: {
      title: "Let's work together.",
      hire: {
        title: 'Hiring?',
        text: 'Tell me about the team and the role. My CV and LinkedIn are one click away.',
        textShort: 'Tell me about the team and the role.',
        link: 'Talk about a role →',
        subject: 'Role: ',
      },
      // An invitation to talk only: no prices, rates, terms or availability
      // (LEG-001, decision 0008).
      project: {
        title: 'Have a project?',
        text: "Share the problem, not just the spec. I'll come back with questions first.",
        link: 'Start a project →',
        subject: 'Project: ',
      },
      // Placeholders until milestone 6 (public email, LinkedIn, GitHub).
      email: '[email address]',
      linkedin: '[LinkedIn]',
      github: '[GitHub]',
    },
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
  caseStudy: {
    back: '← Selected work',
    factsTitle: 'Project facts',
    status: 'Status',
    dates: 'When',
    role: 'My role',
    collaborators: 'Worked with',
    noCollaborators: 'Nobody else',
    ai: 'AI and review',
    stack: 'Built with',
    liveSite: 'Live site',
    draft: 'Draft, not published yet',
  },
  footer: {
    navLabel: 'Footer',
    privacy: 'Privacy',
    printed: 'Printed in three inks: blue, yellow and a little pink.',
  },
}

export type Dictionary = typeof en
