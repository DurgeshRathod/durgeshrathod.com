/**
 * Single source of truth for identity, contact channels, and commercial offers.
 *
 * Everything user-visible that might change — phone number, rates, form key, calendar link —
 * lives here so it is edited in exactly one place. Pages, JSON-LD, llms.txt, the WhatsApp
 * message builder and the OG images all read from this file.
 */

export const SITE = {
  /** Overridden at build time by SITE_URL. Keep in sync with astro.config.mjs default. */
  url: import.meta.env.SITE ?? 'https://durgeshrathod.com',
  name: 'Durgesh Rathod',
  /** Used as the <title> suffix and in schema.org publisher fields. */
  shortName: 'Durgesh Rathod',
  tagline: 'I make AI agents survive production',
  description:
    'I help teams turn AI agent prototypes into systems they can bill customers for — evals, cost control, and observability. 9 years of distributed systems, now applied to agent reliability.',
  locale: 'en',
  /** Asia/Kolkata. Stated explicitly because remote clients need to know overlap up front. */
  timezone: 'Asia/Kolkata',
  utcOffset: '+05:30',
  location: 'Pune, India',
} as const;

export const CONTACT = {
  /** E.164 without '+' or spaces — this exact format is what wa.me requires. */
  whatsapp: '918208406596',
  /** Human-readable form for display. */
  whatsappDisplay: '+91 82084 06596',
  email: 'durgeshrathod.777@gmail.com',
  /** Replace with your Cal.com or Calendly slug. Empty string hides every booking CTA. */
  calLink: 'durgesh-rathod/audit-intro',
  /** Web3Forms access key. Empty string makes the form fall back to a mailto: link. */
  web3FormsKey: '',
} as const;

/**
 * Downloadable CV. One deliberately — offering two tailored versions on the same page
 * presents two identities and weakens the positioning. The GTM version stays for
 * direct applications where it fits better.
 */
export const CV = {
  path: '/cv/Durgesh-Rathod-Technical-Lead-CV.pdf',
  label: 'Technical Lead / AI Reliability CV',
  updated: 'July 2026',
  sizeKb: 169,
} as const;

/**
 * Portrait filename inside /public. About.astro checks for it at build time and falls
 * back to a designed monogram, so a missing file can never ship as a broken image.
 * Drop in a square image, ideally 800×800 or larger.
 */
export const PORTRAIT_CANDIDATES = ['portrait.jpg', 'portrait.jpeg', 'portrait.webp', 'portrait.png'] as const;

/**
 * "Now" block on the about page. The cheapest possible signal that the site is alive
 * rather than a brochure — and the first thing a returning visitor checks.
 * Update it monthly; a stale "now" is worse than none.
 */
export const NOW = {
  updated: '2026-08-02',
  items: [
    'Taking on production readiness audits, and have room for one more retainer.',
    'Published a failure taxonomy of nine named ways production agents break, with causes and fixes for each.',
    'Writing about the cost factors most LLM calculators leave out — starting with tool definitions billed on every call.',
    'Building a public benchmark comparing agent frameworks on identical tasks: tokens, cost, p95 latency and failure modes.',
  ],
} as const;

export const PROFILES = {
  linkedin: 'https://www.linkedin.com/in/durgesh-rathod-711a959b/',
  github: 'https://github.com/DurgeshRathod',
  pypi: 'https://pypi.org/project/fast-intent-classifier/',
  npm: 'https://www.npmjs.com/package/ai-test-gen-angular',
} as const;

/**
 * sameAs targets for the Person entity. Consistent cross-referencing between these
 * profiles and the site is what lets search engines and LLMs treat "Durgesh Rathod"
 * as one resolvable entity rather than an ambiguous string.
 */
export const SAME_AS: readonly string[] = Object.values(PROFILES);

/*
  Six items, capped deliberately. The desktop nav needs ~940px of intrinsic width and only
  displays at >=1024px; an eighth item would not fit. Scorecard and Notes are reachable from
  /tools, the footer, the ⌘K palette and — for the scorecard — every CTA on the site, so
  dropping them from the top level costs little. 'For leaders' earns a slot because it is the
  only tier aimed at people who can approve spend.
*/
export const NAV = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'For leaders', href: '/for-leaders' },
  { label: 'Tools', href: '/tools' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
] as const;

/** Secondary routes: footer and ⌘K only, to keep the top nav inside its width budget. */
export const NAV_SECONDARY = [
  { label: 'Scorecard', href: '/scorecard' },
  { label: 'Notes', href: '/notes' },
  { label: 'Contact', href: '/contact' },
] as const;

/** The three pillars. Referenced by the scorecard, the taxonomy, and the offer page. */
export const PILLARS = [
  {
    id: 'reliability',
    name: 'Reliability',
    claim: 'It works in the demo, not on real data.',
    body: 'No eval suite, no regression tests, no way to know whether a prompt change made things better or quietly worse.',
  },
  {
    id: 'cost',
    name: 'Cost & latency',
    claim: 'Spend and p95 are both a surprise.',
    body: 'No token budget, no model routing, no cost ceiling. Retries stack silently until the invoice arrives.',
  },
  {
    id: 'observability',
    name: 'Observability',
    claim: 'It is a black box when it breaks.',
    body: 'No tracing on tool calls, no way to reproduce a bad run, no shared vocabulary for the ways it fails.',
  },
] as const;

export type PillarId = (typeof PILLARS)[number]['id'];

export const OFFERS = [
  {
    id: 'audit',
    name: 'Agent Production Readiness Audit',
    kind: 'Fixed scope',
    duration: '1–2 weeks',
    priceLow: 4000,
    priceHigh: 6000,
    priceLabel: '$4,000 – $6,000',
    summary:
      'A fixed-price diagnostic on an agent you already have running. You keep everything I build.',
    deliverables: [
      'Failure taxonomy for your specific agent, ranked by production risk',
      'Cost and latency profile — where tokens actually go, and p50/p95 per operation',
      'An eval suite wired to your real traffic that your team owns and keeps running',
      'Prioritised fix list with effort estimates, sequenced by risk reduction per day of work',
      'A 90-minute walkthrough with your engineers, recorded',
    ],
    bestFor:
      'You have an agent in or near production and a growing feeling that you cannot prove it works.',
  },
  {
    id: 'retainer',
    name: 'Fractional AI Reliability Lead',
    kind: 'Monthly retainer',
    duration: '~2 days/week, 3-month minimum',
    priceLow: 5000,
    priceHigh: 8000,
    priceLabel: '$5,000 – $8,000 / month',
    summary:
      'I own agent reliability as a function: evals, observability, and cost discipline, alongside your team.',
    deliverables: [
      'Own and grow the eval suite as your agent surface expands',
      'Tracing and alerting on the failure modes that actually cost you money',
      'Model routing and token budgets — usually the fastest measurable win',
      'Design review on new agent features before they ship, not after',
      'Direct line to me on Slack, and a written monthly reliability report',
    ],
    bestFor:
      'Agents are core to your product and nobody currently owns whether they work.',
  },
] as const;

/**
 * Verified proof points. Every number here is load-bearing: it appears on the homepage,
 * in case studies, in llms.txt, and is the kind of specific, attributable figure that
 * LLMs quote when they cite a source. Do not round these into vagueness.
 */
export const PROOF = [
  {
    value: 520,
    unit: 'M',
    suffix: 'params / 15 min',
    label: 'Telecom data platform throughput',
    detail:
      '200M configuration + 320M performance parameters per 15-minute ingestion cycle, on Golang, Kafka, Kubernetes and PostgreSQL.',
    href: '/work/telecom-throughput',
  },
  {
    value: 2000,
    unit: '',
    suffix: 'concurrent users',
    label: 'Multi-tenant conversational analytics',
    detail:
      'A text-to-SQL agent serving 2,000 concurrent users with strict per-tenant isolation on HR data.',
    href: '/work/hr-analytics-agent',
  },
  {
    value: 30,
    unit: 's',
    suffix: 'from 2–3 days',
    label: 'HR reporting turnaround',
    detail:
      'Conversational analytics replaced a manual reporting cycle that previously took two to three days.',
    href: '/work/hr-analytics-agent',
  },
  {
    value: 9,
    unit: '+',
    suffix: 'years shipping',
    label: 'Production engineering experience',
    detail:
      'Nine years across telecom, HR, recruitment and workflow automation — architecture through production support.',
    href: '/about',
  },
] as const;

/** Cheap central guard so no CTA silently points at an unconfigured channel. */
export const HAS_CAL = CONTACT.calLink.length > 0;
export const HAS_FORM = CONTACT.web3FormsKey.length > 0;
