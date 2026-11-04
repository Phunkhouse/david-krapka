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
      featured: {
        label: 'Main case study · Own product',
        name: 'Kultomat',
        text: 'From the first question to a product that runs every day: the problem, the decisions, the build and what changed afterwards.',
        textShort: 'From the first question to a product that runs every day.',
        // Square brackets: the milestone 6 build check fails while these remain.
        summary: '[One-line summary to be confirmed]',
        screenshot: '[Screenshot of Kultomat goes here]',
        screenshotShort: '[Screenshot of Kultomat]',
      },
      projects: [
        {
          name: 'Eucal',
          label: 'Client · Business needs',
          text: 'Turning business needs into a website visitors can find their way through.',
          textShort:
            'Business needs turned into a website visitors can find their way through.',
        },
        {
          name: 'Vladan Vaněk',
          label: 'Client · Personal identity',
          text: "Content structure and personal presentation for an individual's website.",
          textShort: 'Content structure and personal presentation.',
        },
        {
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
