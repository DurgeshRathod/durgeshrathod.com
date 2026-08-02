# durgeshrathod.com

Static site positioning Durgesh Rathod as an AI agent reliability consultant. Astro 7 +
Tailwind 4, no backend, no adapter — every route is a plain file. Deploys unchanged to
Cloudflare Pages and GitHub Pages.

```bash
npm install --ignore-scripts   # this repo's hook requires the flag
npm run dev                    # http://localhost:4321
npm run build                  # → dist/
npm run preview                # serve dist/
npm run delivery               # → delivery/  (internal client kit, never published)
```

---

## ⚠️ Read this before you publish

Five things need your input. The first two are factual claims made in your voice.

### 1. Verify the "What broke" narratives in the case studies

`src/content/work/*.mdx` each contain a `whatBroke` field and a **What broke** section
written in first person. These are *plausible reconstructions* based on your CV, not
things you told me. They are the most persuasive part of each case study precisely because
they are specific — which is exactly why they must be true.

Read each one and either confirm it, correct it to what actually happened, or replace it.
Do not publish a failure story you cannot stand behind in a client call.

| File | Claim to verify |
| --- | --- |
| `hr-analytics-agent.mdx` | A generated query would have crossed a tenant boundary; caught in staging; led to building an AST-rewriting query gate |
| `multi-agent-orchestration.mdx` | 19 billed model calls to qualify one bad-fit lead, caused by prose output the orchestrator could not branch on |
| `telecom-throughput.mdx` | A ~20% input spike caused an outage due to missing backpressure |

Architecture-diagram node details in those files are also reconstructions. Same rule.

### 2. Re-verify LLM pricing before launch, and on a schedule

`src/data/models.json` holds provider prices verified **2026-08-02** against the sources
listed in `meta.sources`. Two are time-sensitive:

- **Claude Sonnet 5 introductory pricing ends 31 Aug 2026** ($2/$10 → $3/$15). After that
  date the default preset understates cost by ~50% until you update it.
- Tool-use system prompt token counts quoted in `src/content/notes/tool-definition-tax.mdx`
  change between model releases.

Stale pricing on a page selling cost expertise is worse than having no calculator. Update
`meta.updated` whenever you re-verify — it is rendered on the page and in `llms.txt`.

### 3. Set your contact and booking config

Everything commercial lives in `src/consts.ts`:

| Field | Status | Notes |
| --- | --- | --- |
| `CONTACT.whatsapp` | ✅ `918208406596` | E.164, digits only |
| `CONTACT.email` | ✅ `durgeshrathod.777@gmail.com` | |
| `CONTACT.calLink` | ⚠️ placeholder | Real Cal.com/Calendly slug, or `''` to hide every booking CTA |
| `CONTACT.web3FormsKey` | ⚠️ empty | Free key from web3forms.com. Empty → form degrades to a structured `mailto:` |
| `OFFERS[].price*` | Review | $4–6k audit, $5–8k/mo retainer |

`wa.me` publishes your phone number, so it will eventually be scraped. Consider a separate
business number.

### 4. Use a custom domain

Canonical URLs, sitemap, OG images and `llms.txt` all derive from `SITE_URL`. A
`github.io` URL on a page selling $6k audits undercuts the thing it is selling.

### 5. Portrait — done, with one optional upgrade

`public/portrait.jpg` + `.webp` (800×800) and `portrait-160.*` (avatar) are generated from
`~/Downloads/durgesh-rathod-profile-pic.jpeg`. Used in three places: the About page sidebar, the
homepage availability panel, and every generated OG social card. Also declared as `image` on the
`Person` schema node, which helps entity resolution.

The photo is a travel selfie — the airline seat and puffer jacket are readable in the background.
It works, and it is far better than a monogram. A neutral-background shot in a plain shirt would
read closer to "consultant enterprises hire" and is the one remaining upgrade. To swap it:

```bash
node -e "const s=require('sharp');const f='/path/to/new.jpg';(async()=>{
  await s(f).resize(800,800).jpeg({quality:82,mozjpeg:true}).toFile('public/portrait.jpg');
  await s(f).resize(800,800).webp({quality:76}).toFile('public/portrait.webp');
  await s(f).resize(160,160).jpeg({quality:80,mozjpeg:true}).toFile('public/portrait-160.jpg');
  await s(f).resize(160,160).webp({quality:74}).toFile('public/portrait-160.webp');
  await s(f).resize(200,200).jpeg({quality:82,mozjpeg:true}).toFile('src/assets/portrait-og.jpg');
})()"
```

Delete all five and the About page falls back to a designed monogram and the OG cards drop the
avatar — neither breaks the build.

### 6. Keep "What I'm doing now" current

`NOW` in `src/consts.ts`, rendered with its date on the About page. A stale "now" block is worse
than none — it advertises that the site is abandoned. Update it when you publish something or
change availability, and bump `NOW.updated`.

The four current items are drawn from what actually exists plus the benchmark we discussed as a
plan. **Check item 4 before publishing** — if you are not building the benchmark, remove it. It
reads as a commitment.

### 7. Add real recommendations when you have them

`src/data/testimonials.json` ships with an empty array, so the About page renders a verification
block (LinkedIn, GitHub, references-on-request) instead of an empty testimonials shelf. Paste real
quotes in and the component switches automatically.

Copy your LinkedIn recommendations **verbatim** with the person's name and title — they are
already publicly attributed there, so reproducing them is standard practice; paraphrasing them
is not. I could not read them myself: LinkedIn returns HTTP 999 to any automated fetch.

### 8. Add analytics

Nothing is installed. Cloudflare Web Analytics or Umami — you need to know which pages
produce WhatsApp clicks. Every CTA already carries a `data-analytics` attribute for this.

---

## Client delivery kit

Engagement delivery assets (playbooks, trackers, report templates) are generated from
`src/data/*.json` by tooling that lives in a **separate private repository** — it contains
commercial material that does not belong in a public repo.

`npm run delivery` works only when that tooling is present locally. Output goes to `delivery/`,
which is gitignored and must never be moved into `public/`.

The design principle worth recording here: those templates are generated from the same JSON the
site renders, so what is delivered to a client cannot drift from what the site publicly promises.

## Deploying

### Cloudflare Pages (recommended)

Build `npm run build`, output `dist`. Set env var `SITE_URL=https://yourdomain.com`.
Gets you `public/_headers` (security + cache headers) and free privacy-friendly analytics.

### GitHub Pages (mirror)

`.github/workflows/deploy-github-pages.yml` is checked in. Set repo variable `SITE_URL`.
Only set `BASE_PATH` (e.g. `/durgesh-portfolio`) for a **project** site — prefer a custom
domain or a `<user>.github.io` repo. GitHub Pages ignores `_headers`; that is the only
capability difference.

---

## Editing content

All dynamic features are JSON-driven. Edit the JSON, not the components.

| What | File |
| --- | --- |
| Scorecard questions, gaps, business risk, effort days, score bands, decision lines | `src/data/scorecard.json` |
| Model pricing, workload presets, cost caveats | `src/data/models.json` |
| Failure taxonomy (symptoms, causes, fixes) | `src/data/taxonomy.json` |
| Identity, contact, offers, proof numbers, nav | `src/consts.ts` |
| Solution pages (hub + 5 spokes) | `src/data/solutions.json` |
| Industry pages (hub + 4 spokes) | `src/data/industries.json` |
| Leader/decision pages (hub + 5 spokes) | `src/data/decisions.json` |
| Case studies | `src/content/work/*.mdx` |
| Articles | `src/content/notes/*.mdx` |
| OG image titles | `src/lib/og-manifest.ts` |
| Colours / design tokens | `src/styles/global.css` (`@theme` + `:root` / `[data-theme='dark']`) |

### Colour roles

Signal blue: `--accent` `#1d4ed8` light / `#60a5fa` dark. Four roles, deliberately separate —
mixing them is what makes a palette look accidental:

- `--accent` — accent **text** and graphics. Needs contrast against the page.
- `--accent-solid` / `--accent-solid-fg` — filled **buttons and badges**. In dark mode this is a
  deeper blue with white type; `--accent` is too light to be a confident fill.
- `--good` / `--warn` / `--risk` — **status only**, never brand or series. Amber means "warning"
  and nothing else.
- `--chart-1…4` — **categorical chart slots** for the cost-composition bar.

⚠️ **Do not reorder `--chart-1…4`.** The order blue → aqua → violet → magenta is the one that
passes colour-blind separation in both modes; swapping any adjacent pair fails (blue↔violet drop
to ΔE 9.8 for normal vision, aqua↔magenta to ΔE 1.6 under deuteranopia). Chart blue is a deeper
step than `--accent` on purpose: a fill must sit inside the dark lightness band L 0.48–0.67.

To change the brand hue, edit the `--color-signal-*` scale in `@theme` and re-point `--accent`
and `--accent-solid`. Everything else follows.

**Light is the default theme**, deliberately ignoring the visitor's OS preference — dark applies
only when someone picks it with the toggle, and that choice persists in `localStorage`. The
resolution runs in an inline script in `src/layouts/Base.astro` *before* first paint, so there is
no flash of the wrong theme. To follow the OS instead, restore the
`matchMedia('(prefers-color-scheme: dark)')` check there; no CSS depends on it.

Each tool inlines its JSON into a `<script type="application/json">` block, so there is no
runtime `fetch` — which is why they work under a GitHub Pages base path and offline.

Adding a page? Add it to `OG_PAGES` in `src/lib/og-manifest.ts` or it falls back to a
missing OG image. Notes and case studies get theirs generated automatically.

---

## The SEO content plan (hub-and-spoke, deliberately capped)

`/solutions` is the first of four planned hubs. The structure is capped on purpose — 16 spokes
is a realistic year of monthly writing, and a site with 8 excellent pages outranks the same site
with 8 excellent plus 32 thin ones.

| Hub | Status | Spokes | Why this tier |
|---|---|---|---|
| `/solutions` | **built — 5 spokes** | eval suites · observability · cost reduction · multi-tenant isolation · text-to-SQL | Only tier that pays off at zero traffic — usable as outbound landing pages today |
| `/industries` | **built — 4 spokes** | HR tech · recruitment & ATS · telecom & data platforms · legal & contracts | Credible only because of shipped work in each — do not add a fifth without it |
| `/for-leaders` | **built — 5 spokes** | audit scope · launch questions · build-or-buy · metrics · do-you-need-help | The only tier aimed at people who can approve spend |
| `/compare` | planned | LangGraph vs CrewAI vs raw SDK · Langfuse vs LangSmith vs Braintrust · MCP vs function calling | Highest purchase intent |
| `/stack` | planned | MCP in production · MCP security · CrewAI · Bedrock | Highest search interest, goes stale fastest — do last |

### The scorecard is the engineer→buyer bridge

Its results panel opens with an **executive summary** computed from the answers: the business
consequence of each critical gap (`gap.businessRisk`), a real total of engineering days summed from
`gap.effortDays`, and one recommended decision chosen from `decisions[]` by critical-gap count and
score. It prints first and has a "copy summary to forward" button producing plain text for an email.

This exists because an engineer runs the scorecard but a manager approves the work. The technical
gap list persuades the first person; the exec summary is what the second one reads.

Two data conventions to preserve when editing questions:

- **`gap.businessRisk`** must be plain language a non-engineer acts on — a consequence, not a
  mechanism. "The agent can act on invented data" rather than "tool arguments are unvalidated."
- **`gap.effortDays: {min, max}`** drives the day total. Set both to `0` for gaps that are
  organisational rather than engineering (currently only `ownership`) — the summary counts those
  separately so the day figure stays honest.

### Why `/for-leaders` exists

Roughly 70% of the site's queries reach engineers, who are influencers rather than buyers. This
tier targets the two cases where the searcher can also sign the invoice: cost pain (it shows up on
a P&L) and compliance deadlines. Every page opens with an `answerFirst` block — the passage a busy
manager reads before deciding whether to scroll, and the passage an AI answer engine extracts.

Each page routes to the scorecard, because the scorecard is the bridge: an engineer runs it, gets
a printable score with ranked gaps, and forwards it to whoever approves work. That is the mechanism
that turns engineer traffic into buyer conversations.

**Nav is capped at six items.** The desktop nav needs ~940px of intrinsic width and only displays
at >=1024px, so a seventh item overflows on small laptops. Scorecard and Notes moved to
`NAV_SECONDARY` (footer + ⌘K); the scorecard is still linked from nearly every CTA. If you add a
hub, remove one.

### Validate data files after editing

Table rows must match their column count or cells render misaligned. This catches it:

```bash
node -e 'const fs=require("fs");let bad=0;
for(const f of ["solutions.json","industries.json","decisions.json"]){
 const d=JSON.parse(fs.readFileSync("src/data/"+f));
 (d.solutions||d.industries||d.decisions).forEach(i=>["asset","secondAsset"].forEach(k=>{
  const a=i[k]; if(a&&a.kind==="table") a.rows.forEach((r,n)=>{
   if(r.length!==a.columns.length){console.log("MISMATCH",f,i.slug,k,"row",n);bad++}})}))}
console.log(bad?bad+" issue(s)":"all tables valid")'
```

### Industry pages: two standing maintenance items

**Regulatory claims have dates on them.** The HR and recruitment pages state that EU AI Act
Annex III high-risk obligations apply from **2 August 2026**, with penalties to €15M or 3% of
global turnover, and note that the Commission's November 2025 Digital Omnibus proposal may move
that date but is not enacted law. If the Omnibus passes, both pages need updating —
`regulatory[].effective` and the matching FAQ answer in `src/data/industries.json`. Every
regulatory block renders the shared `meta.legalDisclaimer`; keep it.

**Do not add a fifth industry without shipped work in it.** The whole reason these pages are
worth publishing is the `proof` block. An industry page for a domain you have not delivered in is
the industry-noun-swap filler that drags down the pages you wrote properly.

⚠️ **Unresolved:** your two CVs disagree about the agentic voice assistant — the Technical Lead CV
says HR interviews, the GTM CV's project section says healthcare. A healthcare industry page is
not built for that reason. Resolve which is accurate before claiming healthcare anywhere.

**The non-negotiable rule:** every page must contain something that exists nowhere else — a
number, a named failure mode with a diagnostic check, a spec, or a checklist. Each solution page
carries one or two (`asset` / `secondAsset` in the JSON): the 30-eval-case distribution, the
minimum viable trace field spec, the ranked cost levers, the layered isolation checklist, the
query gate. That artefact is the page's reason to exist and the thing that gets it linked and
cited. A page that only swaps an industry noun is worse than no page — it drags the quality
signal of the ones you wrote properly.

Adding a sixth solution is a data edit: append to `src/data/solutions.json`. The route, OG image,
`llms.txt` entry, `llms-full.txt` section, sitemap entry and ⌘K index all derive from it.

Two content-field gotchas: the prose fields render as **plain text**, so no markdown (`*emphasis*`
appears literally); and `relatedFailures` must reference real `id` values from
`src/data/taxonomy.json` or the links silently drop.

## Architecture decisions worth knowing

**Crawlers do not run JavaScript, so no content is JS-only.** All 12 scorecard questions
with their gap explanations, all 9 taxonomy entries with causes and fixes, the full pricing
table, and every architecture-diagram node detail are in the static HTML. JS only adds
interactivity. This is what makes the tools rank and makes them quotable by AI answer
engines — verify it stays true if you refactor:

```bash
npm run build
grep -c "data-symptom" dist/tools/failure-taxonomy/index.html   # expect 9 (+2 attr refs)
grep -q "No regression safety net" dist/scorecard/index.html && echo "scorecard crawlable"
```

**AI crawlers are allowed on purpose.** `src/pages/robots.txt.ts` explicitly allows GPTBot,
ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended and others. Blocking them is
publisher advice; for a consultant, being citable when someone asks an assistant "who can
fix our AI agent" is the entire point.

**`/llms.txt` and `/llms-full.txt` are generated,** not hand-written, from the same data the
pages render — so they cannot drift. `llms-full.txt` (~40kb) is the complete substantive
content of the site as plain text, so a model that fetches one URL gets everything.

**One JSON-LD `@graph` per page with stable `@id`s.** Person, WebSite and ProfessionalService
cross-reference by `@id`, and `sameAs` links LinkedIn/GitHub/PyPI/npm, so "Durgesh Rathod"
resolves as one entity rather than an ambiguous string.

**Scroll reveal fails open.** Content above the fold is revealed with no animation, and a
3-second failsafe reveals everything regardless. Hiding content behind JS is only acceptable
if the failure mode is "no animation", never "no content".

**Scorecard PDF is `window.print()`**, not a bundled PDF library — a print stylesheet strips
navigation and interactive controls. Saves ~200kb and nothing is uploaded to produce it.

**No webfont requests.** Inter is self-hosted (48kb woff2, preloaded). OG images are
generated at build time by satori with explicit font buffers, so output is identical
locally and in CI.

---

## Verified at build time

15 pages · 0 build errors · 0 npm vulnerabilities · 0 console errors · no horizontal
overflow at 606px on any page · exactly one `<h1>` per page · valid JSON-LD on all 15 ·
canonical tags with no trailing slash · 14 OG images.
