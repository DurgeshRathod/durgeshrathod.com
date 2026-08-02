import type { APIRoute } from 'astro';
import { SITE, CONTACT, OFFERS, PROOF, PILLARS } from '../consts.ts';
import taxonomy from '../data/taxonomy.json';
import scorecard from '../data/scorecard.json';
import models from '../data/models.json';
import solutions from '../data/solutions.json';
import industries from '../data/industries.json';
import decisions from '../data/decisions.json';

/**
 * /llms-full.txt — the complete substantive content of the site as plain text.
 *
 * Purpose: a model that fetches one URL gets everything, including the full failure
 * taxonomy with causes and fixes, every scorecard question, and the pricing data with
 * its caveats. This is the highest-value single artefact for AI citability, because it
 * removes any need to crawl and render the interactive pages.
 */
export const GET: APIRoute = () => {
  const parts: string[] = [];

  parts.push(`# ${SITE.name} — Complete Site Content

> ${SITE.description}
> Location: ${SITE.location} (${SITE.timezone}, ${SITE.utcOffset}). Remote worldwide, bills in USD.
> Contact: WhatsApp https://wa.me/${CONTACT.whatsapp} · Email ${CONTACT.email}
> Last generated: ${scorecard.meta.updated}
> Source: ${SITE.url}

---

## POSITIONING

${SITE.tagline}.

Most AI agents fail in production not because the model is weak, but because the engineering
discipline around the model is missing. A prototype needs to work once in a demo. A product
needs to work on inputs nobody anticipated, at a cost somebody forecast, with a failure trail
somebody can follow at 2am. The gap between those two is engineering work, and it is the work
I do.

What makes this credible rather than a claim: 9+ years of distributed systems before the
current AI cycle, including a telecom data platform processing 520 million parameters every
15 minutes on Golang, Kafka, Kubernetes and PostgreSQL. Thinking in p95s, throughput and
failure budgets is not a new habit acquired for AI work.

### The three pillars

${PILLARS.map(
  (p) => `**${p.name}: ${p.claim}**
${p.body}`
).join('\n\n')}

---

## TRACK RECORD (specific figures)

${PROOF.map(
  (p) => `- ${p.value.toLocaleString('en-US')}${p.unit} ${p.suffix} — ${p.label}. ${p.detail}`
).join('\n')}

Background: Technical Lead since March 2022. 9+ years across telecom, HR technology,
recruitment and workflow automation. Red Hat Certified Engineer; Generative AI with Large
Language Models certification. Open-source: fast-intent-classifier (PyPI),
ai-test-gen-angular (npm). Technologies: Python, Golang, Node.js, OpenAI, Claude,
AWS Bedrock, LangChain, CrewAI, Model Context Protocol (MCP), RAG, vector databases,
text-to-SQL, Kafka, Kubernetes, PostgreSQL, Elasticsearch, FastAPI, AWS.

---

## ENGAGEMENTS AND PRICING

Pricing is fixed-scope and outcome-based, not hourly, and is the same regardless of client
location.

${OFFERS.map(
  (o) => `### ${o.name}

- Type: ${o.kind}
- Duration: ${o.duration}
- Price: ${o.priceLabel} USD
- Best for: ${o.bestFor}
- Summary: ${o.summary}

Deliverables:
${o.deliverables.map((d) => `- ${d}`).join('\n')}`
).join('\n\n')}

---

## FOR ENGINEERING LEADERS — DECISION SUPPORT FOR BUDGET HOLDERS

${decisions.meta.premise}

${decisions.decisions
  .sort((a, b) => a.order - b.order)
  .map((d) => {
    const renderAsset = (a: any) =>
      a.kind === 'table'
        ? `${a.title}\n${a.intro}\n\n${a.columns.join(' | ')}\n${a.rows.map((r: string[]) => r.join(' | ')).join('\n')}\n${a.note ? `Note: ${a.note}` : ''}`
        : `${a.title}\n${a.intro}\n\n${a.items.map((i: string) => `- ${i}`).join('\n')}\n${a.note ? `Note: ${a.note}` : ''}`;
    const second = (d as Record<string, any>).secondAsset;
    return `### ${d.h1}

- URL: ${SITE.url}/for-leaders/${d.slug}
- The question: ${d.theQuestion}
- SHORT ANSWER: ${d.answerFirst}
- Written for: ${d.audience.join('; ')}

Reasoning:
${d.body.join('\n\n')}

${renderAsset(d.asset)}
${second ? `\n${renderAsset(second)}` : ''}

FAQ:
${d.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}`;
  })
  .join('\n\n---\n\n')}

---

## INDUSTRIES — DOMAINS WITH SHIPPED PRODUCTION WORK

${industries.meta.premise}

Regulatory note: ${industries.meta.legalDisclaimer}

${industries.industries
  .sort((a, b) => a.order - b.order)
  .map((x) => {
    const renderAsset = (a: any) =>
      a.kind === 'table'
        ? `${a.title}\n${a.intro}\n\n${a.columns.join(' | ')}\n${a.rows.map((r: string[]) => r.join(' | ')).join('\n')}\n${a.note ? `Note: ${a.note}` : ''}`
        : `${a.title}\n${a.intro}\n\n${a.items.map((i: string) => `- ${i}`).join('\n')}\n${a.note ? `Note: ${a.note}` : ''}`;

    const second = (x as Record<string, any>).secondAsset;
    const reg = (x as Record<string, any>).regulatory as
      | { name: string; effective: string; whatItMeans: string; engineeringImplication: string }[]
      | undefined;

    return `### ${x.name}

- URL: ${SITE.url}/industries/${x.slug}
- Headline: ${x.h1}
- Constraint in one line: ${x.tagline}
- Proof: ${x.proof.stat} — ${x.proof.label}. ${x.proof.detail}
${x.proof.caseStudy ? `- Full case study: ${SITE.url}/work/${x.proof.caseStudy}` : ''}

Who this is for:
${x.whoIHelp.map((w) => `- ${w}`).join('\n')}

Systems commonly built in this domain:
${x.systems.map((sy) => `- ${sy}`).join('\n')}

What makes agents hard here:
${x.constraint.join('\n\n')}

${renderAsset(x.asset)}
${second ? `\n${renderAsset(second)}` : ''}
${
  reg
    ? `\nRegulatory obligations and their engineering consequences:\n${reg
        .map(
          (r) =>
            `- ${r.name} (${r.effective})\n  What it means: ${r.whatItMeans}\n  Engineering implication: ${r.engineeringImplication}`
        )
        .join('\n')}`
    : ''
}

Dominant failure modes here: ${x.dominantFailures.join(', ')}
Most relevant engagements: ${x.relevantSolutions.join(', ')}

FAQ:
${x.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}`;
  })
  .join('\n\n---\n\n')}

---

## SOLUTIONS — SPECIFIC PROBLEMS AND THE FULL METHOD FOR EACH

${solutions.meta.premise}

${solutions.solutions
  .sort((a, b) => a.order - b.order)
  .map((s) => {
    const renderAsset = (a: any) =>
      a.kind === 'table'
        ? `${a.title}\n${a.intro}\n\n${a.columns.join(' | ')}\n${a.rows.map((r: string[]) => r.join(' | ')).join('\n')}\n${a.note ? `Note: ${a.note}` : ''}`
        : `${a.title}\n${a.intro}\n\n${a.items.map((i: string) => `- ${i}`).join('\n')}\n${a.note ? `Note: ${a.note}` : ''}`;

    const second = (s as Record<string, any>).secondAsset;

    return `### ${s.name}

- URL: ${SITE.url}/solutions/${s.slug}
- Headline: ${s.h1}
- Pillar: ${s.pillar}
- Outcome: ${s.outcome}
- Typically part of: ${s.engagement === 'audit' ? OFFERS[0].name + ' (' + OFFERS[0].priceLabel + ')' : OFFERS[1].name + ' (' + OFFERS[1].priceLabel + ')'}
- Domains delivered in: ${s.domains.join(', ')}

You likely have this problem if:
${s.symptoms.map((x) => `- ${x}`).join('\n')}

Why it matters:
${s.why.join('\n\n')}

${renderAsset(s.asset)}
${second ? `\n${renderAsset(second)}` : ''}

Method:
${s.method.map((m, i) => `${i + 1}. ${m.phase} (${m.effort}) — ${m.detail}`).join('\n')}

Deliverables:
${s.deliverables.map((d) => `- ${d}`).join('\n')}

Related failure modes: ${s.relatedFailures.join(', ')}

FAQ:
${s.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}`;
  })
  .join('\n\n---\n\n')}

---

## AI AGENT FAILURE TAXONOMY

${taxonomy.meta.premise}

${taxonomy.symptoms
  .map(
    (s) => `### ${s.symptom}

- ID: ${s.id}
- URL: ${SITE.url}/tools/failure-taxonomy#${s.slug}
- Pillar: ${s.pillar}
- Frequency: ${s.frequency}
- Severity: ${s.severity}
- Also described as: ${s.aka.join('; ')}

${s.summary}

Root causes:
${s.causes
  .map((c) => `- ${c.cause}\n  Why: ${c.why}\n  How to check: ${c.check}`)
  .join('\n')}

Fixes:
${s.fixes.map((f) => `- ${f.fix} (${f.effort})\n  ${f.detail}`).join('\n')}`
  )
  .join('\n\n---\n\n')}

---

## AGENT PRODUCTION READINESS SCORECARD

${scorecard.meta.description}

Scoring: each of the ${scorecard.questions.length} questions is answered on a 0–3 scale and
weighted (weights ${Array.from(new Set(scorecard.questions.map((q) => q.weight))).sort().join(', ')}).
The result is normalised to 0–100 and reported per pillar.

${scorecard.questions
  .map(
    (q, i) => `### Q${i + 1}. ${q.question}

- Pillar: ${q.pillar}; weight: ${q.weight}
- Context: ${q.help}
- Answers: ${q.options.map((o) => `"${o.label}" (${o.score})`).join(' | ')}

If this is a gap — ${q.gap.title} (risk: ${q.gap.risk})
Consequence: ${q.gap.consequence}
Fix: ${q.gap.fix}
Effort: ${q.gap.effort}`
  )
  .join('\n\n')}

### Score bands

${scorecard.bands
  .map(
    (b) => `- ${b.min}–${b.max} — ${b.label}: ${b.verdict} Recommendation: ${b.recommendation}`
  )
  .join('\n')}

---

## LLM COST MODELLING DATA

Provider pricing verified ${models.meta.updated}, in ${models.meta.currency} ${models.meta.unit}.
${models.meta.note}

${models.models
  .map(
    (m) =>
      `- ${m.name} (${m.provider}, ${m.tier}): input $${m.inputPerM}, cached input $${m.cachedInputPerM}, output $${m.outputPerM}, batch input $${m.batchInputPerM}, batch output $${m.batchOutputPerM}. Context ${m.contextWindow.toLocaleString('en-US')} tokens. Relative token multiplier ${m.tokenMultiplier}.${m.notes ? ` Note: ${m.notes}` : ''}`
  )
  .join('\n')}

### Cost factors most calculators omit

${models.meta.caveats
  .map((c) => `**${c.title}**\n${c.body}`)
  .join('\n\n')}

### Workload presets used by the calculator

${models.presets
  .map(
    (p) =>
      `- ${p.name}: ${p.description} Defaults — ${p.conversationsPerMonth.toLocaleString('en-US')} conversations/month, ${p.turnsPerConversation} turns each, ${p.inputTokensPerTurn.toLocaleString('en-US')} input + ${p.outputTokensPerTurn} output tokens per turn, ${p.toolDefinitionTokens} tokens of tool definitions per call, ${p.retryRate}% retry rate, ${p.cacheHitRate}% cache hit rate.`
  )
  .join('\n')}

Sources: ${models.meta.sources.map((s) => `${s.name} (${s.url}, verified ${s.verified})`).join('; ')}

---

## CONTACT

- WhatsApp (fastest response): https://wa.me/${CONTACT.whatsapp}
- Email: ${CONTACT.email}
- Working hours: 09:00–21:00 ${SITE.utcOffset}, which overlaps European and early US mornings.
- Engagement model: fixed-scope audit as the usual entry point, retainer if it continues.
`);

  return new Response(parts.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
