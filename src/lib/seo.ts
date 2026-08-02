import { SITE, CONTACT, SAME_AS, OFFERS, PROFILES } from '../consts.ts';

/**
 * Structured data as a single @graph with stable @ids.
 *
 * The @id cross-referencing is the part that matters and the part most sites skip:
 * it lets a crawler resolve "Durgesh Rathod" the string into one entity that owns
 * this site, offers these services, and is the same person as those GitHub / PyPI /
 * LinkedIn profiles. Disconnected schema blobs on separate pages do not achieve that.
 */

export const ID = {
  person: `${SITE.url}/#person`,
  website: `${SITE.url}/#website`,
  service: `${SITE.url}/#service`,
} as const;

/**
 * Canonical URL: absolute, no trailing slash, no index suffix. One spelling per page.
 *
 * The root is the exception and gets a trailing slash. Not a style choice — the WHATWG URL
 * API normalises `new URL('https://x.com').href` to `'https://x.com/'`, so @astrojs/sitemap
 * cannot emit a bare origin however it is serialised. Matching it here keeps the sitemap and
 * the canonical tag byte-identical, which is assertable in CI rather than merely intended.
 */
export function canonical(pathname: string): string {
  const clean = pathname.replace(/\/index\.html?$/, '').replace(/\/+$/, '');
  return clean ? `${SITE.url}${clean}` : `${SITE.url}/`;
}

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': ID.person,
    name: SITE.name,
    givenName: 'Durgesh',
    familyName: 'Rathod',
    url: SITE.url,
    email: `mailto:${CONTACT.email}`,
    telephone: `+${CONTACT.whatsapp}`,
    jobTitle: 'AI Reliability Engineer & Technical Lead',
    // A resolvable image strengthens entity resolution — it is one of the signals that
    // links this Person node to the same individual across LinkedIn, GitHub and search.
    image: {
      '@type': 'ImageObject',
      url: `${SITE.url}/portrait.jpg`,
      width: 800,
      height: 800,
      caption: SITE.name,
    },
    description:
      'Technical lead with 9+ years in distributed systems and production AI, specialising in making AI agent systems reliable, observable, and affordable enough to run in production.',
    knowsAbout: [
      'AI agent reliability',
      'LLM evaluation and testing',
      'LLM observability and tracing',
      'LLM cost optimisation',
      'Model Context Protocol',
      'Multi-agent orchestration',
      'Retrieval-augmented generation',
      'Distributed systems',
      'Apache Kafka',
      'Kubernetes',
      'Golang',
      'Python',
      'Text-to-SQL',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    sameAs: SAME_AS,
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Bachelor of Engineering, Computer Engineering',
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Red Hat Certified Engineer',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Generative AI with Large Language Models',
      },
    ],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': ID.person },
    author: { '@id': ID.person },
  };
}

/**
 * ProfessionalService with explicit Offers. This is what makes the commercial
 * side of the site machine-readable — the priced offers are the reason someone
 * asking an assistant "who can audit my AI agent" could surface this page.
 */
export function serviceSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': ID.service,
    name: 'Durgesh Rathod — AI Agent Reliability Consulting',
    url: `${SITE.url}/work-with-me`,
    description:
      'Independent consulting that takes AI agent prototypes to production: eval suites, observability and tracing, cost and latency control.',
    provider: { '@id': ID.person },
    founder: { '@id': ID.person },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide — remote, working from Asia/Kolkata (UTC+05:30)',
    },
    availableLanguage: ['English', 'Hindi', 'Marathi'],
    serviceType: [
      'AI agent reliability audit',
      'LLM evaluation engineering',
      'LLM observability implementation',
      'LLM cost optimisation',
      'Fractional AI engineering leadership',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Engagements',
      itemListElement: OFFERS.map((o) => ({
        '@type': 'Offer',
        name: o.name,
        description: o.summary,
        category: o.kind,
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: o.priceLow,
          maxPrice: o.priceHigh,
          ...(o.id === 'retainer' ? { billingIncrement: 1, unitText: 'MONTH' } : {}),
        },
        itemOffered: {
          '@type': 'Service',
          name: o.name,
          description: o.summary,
        },
      })),
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: canonical(t.path),
    })),
  };
}

export interface QA {
  q: string;
  a: string;
}

/**
 * FAQPage. Question-shaped headings with direct answers are the single most
 * extractable content format for both AI answer engines and search snippets.
 */
export function faqSchema(items: QA[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  published: string;
  updated?: string;
  section?: string;
  keywords?: string[];
}) {
  return {
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: canonical(opts.path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical(opts.path) },
    datePublished: opts.published,
    dateModified: opts.updated ?? opts.published,
    author: { '@id': ID.person },
    publisher: { '@id': ID.person },
    isPartOf: { '@id': ID.website },
    inLanguage: 'en',
    ...(opts.section ? { articleSection: opts.section } : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(', ') } : {}),
  };
}

/** Interactive tools describe themselves as WebApplications — free, no login. */
export function toolSchema(opts: {
  name: string;
  description: string;
  path: string;
  category?: string;
}) {
  return {
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: canonical(opts.path),
    applicationCategory: opts.category ?? 'DeveloperApplication',
    operatingSystem: 'Any — runs in the browser',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    author: { '@id': ID.person },
    publisher: { '@id': ID.person },
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  };
}

export function caseStudySchema(opts: {
  title: string;
  description: string;
  path: string;
  published: string;
  updated?: string;
  keywords?: string[];
}) {
  return {
    ...articleSchema({ ...opts, section: 'Case study' }),
    '@type': 'Article',
    genre: 'Case study',
  };
}

export function softwareSourceSchema() {
  return [
    {
      '@type': 'SoftwareApplication',
      name: 'fast-intent-classifier',
      description: 'Open-source Python package for fast intent classification.',
      url: PROFILES.pypi,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      author: { '@id': ID.person },
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'ai-test-gen-angular',
      description:
        'Open-source npm package that generates Angular unit tests using large language models.',
      url: PROFILES.npm,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      author: { '@id': ID.person },
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
    },
  ];
}

/** Wrap page-specific nodes into the site-wide graph. */
export function graph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [personSchema(), websiteSchema(), serviceSchema(), ...nodes],
  };
}
