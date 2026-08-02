import { OFFERS } from '../consts.ts';
import solutions from '../data/solutions.json';
import industries from '../data/industries.json';
import decisions from '../data/decisions.json';

/**
 * Pages that get a generated Open Graph image.
 *
 * Slugs mirror the path with '/' replaced by '-' (see Seo.astro), so /tools/ai-agent-failure-modes
 * resolves to /og/tools-failure-taxonomy.png. Keeping one explicit manifest means the image
 * set is auditable rather than implicit.
 */
export interface OgEntry {
  slug: string;
  kind: string;
  title: string;
  /** Small print bottom-right — usually a number worth leading with. */
  stat?: string;
}

export const OG_PAGES: OgEntry[] = [
  {
    slug: 'index',
    kind: 'AI agent reliability',
    title: 'I make AI agents survive production',
    stat: '9+ years distributed systems',
  },
  {
    slug: 'work-with-me',
    kind: 'Engagements',
    title: 'Fixed-scope audits and reliability retainers',
    stat: OFFERS.map((o) => o.priceLabel).join('  ·  '),
  },
  {
    slug: 'scorecard',
    kind: 'Free assessment · 4 minutes',
    title: 'Is your AI agent actually production-ready?',
    stat: '12 questions · scored 0–100',
  },
  {
    slug: 'tools',
    kind: 'Free tools',
    title: 'Tools for teams running agents in production',
  },
  {
    slug: 'tools-agent-cost-calculator',
    kind: 'Free tool',
    title: 'What will your AI agent actually cost per month?',
    stat: 'Provider pricing verified Aug 2026',
  },
  {
    slug: 'tools-failure-taxonomy',
    kind: 'Free reference',
    title: 'Nine ways production AI agents fail',
    stat: 'Causes, checks and fixes for each',
  },
  {
    slug: 'work',
    kind: 'Case studies',
    title: 'Systems I have taken to production',
  },
  {
    slug: 'work-hr-analytics-agent',
    kind: 'Case study',
    title: 'A text-to-SQL agent 2,000 people could trust',
    stat: 'Reporting: 2–3 days → under 30 seconds',
  },
  {
    slug: 'work-multi-agent-orchestration',
    kind: 'Case study',
    title: 'Multi-agent systems without the spiral',
    stat: 'MCP · CrewAI · production',
  },
  {
    slug: 'work-telecom-throughput',
    kind: 'Case study',
    title: '520 million parameters every 15 minutes',
    stat: 'Golang · Kafka · Kubernetes · PostgreSQL',
  },
  {
    slug: 'about',
    kind: 'About',
    title: 'Nine years of production systems, now aimed at agents',
  },
  {
    slug: 'notes',
    kind: 'Notes',
    title: 'Writing on agent reliability, cost and observability',
  },
  {
    slug: 'contact',
    kind: 'Contact',
    title: "Let's talk about your agent",
    stat: 'WhatsApp · usually same day',
  },
  {
    slug: 'solutions',
    kind: 'Solutions',
    title: 'Five things I get hired to do',
    stat: 'Full method and effort on every page',
  },
  // One card per solution, generated from the same data the pages render.
  ...solutions.solutions.map((s) => ({
    slug: `solutions-${s.slug}`,
    kind: 'Solution',
    title: s.h1,
    stat: s.tagline,
  })),
  {
    slug: 'industries',
    kind: 'Industries',
    title: 'Four domains I have actually shipped in',
    stat: 'HR tech · Recruitment · Telecom · Legal',
  },
  {
    slug: 'for-leaders',
    kind: 'For engineering leaders',
    title: 'Decisions you own, not code you write',
    stat: 'Audit scope · launch review · build-or-buy · metrics',
  },
  ...decisions.decisions.map((d) => ({
    slug: `for-leaders-${d.slug}`,
    kind: 'Decision support',
    title: d.h1,
    stat: d.tagline,
  })),
  ...industries.industries.map((x) => ({
    slug: `industries-${x.slug}`,
    kind: x.name,
    title: x.h1,
    stat: `${x.proof.stat} — ${x.proof.label}`,
  })),
];
